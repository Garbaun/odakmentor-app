import {
    mediaDevices,
    MediaStream,
    MediaStreamConstraints,
    RTCPeerConnection
} from 'react-native-webrtc';
import { io } from 'socket.io-client';

export interface VideoConferenceConfig {
  serverUrl: string;
  roomId: string;
  userId: string;
  userName: string;
  userRole: 'teacher' | 'student';
}

export interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  stream?: MediaStream;
}

export interface VideoConferenceCallbacks {
  onParticipantsUpdate: (participants: Participant[]) => void;
  onConnectionStateChange: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onError: (error: string) => void;
  onMessage: (message: { from: string; text: string; timestamp: number }) => void;
}

export class VideoConferenceService {
  private socket: Socket | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private config: VideoConferenceConfig | null = null;
  private callbacks: VideoConferenceCallbacks | null = null;
  private participants: Map<string, Participant> = new Map();

  constructor() {
    this.setupWebRTC();
  }

  private setupWebRTC() {
    // WebRTC yapılandırması
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
    };

    // Global RTCPeerConnection yapılandırması
    (global as any).RTCPeerConnection = RTCPeerConnection;
  }

  async initialize(config: VideoConferenceConfig, callbacks: VideoConferenceCallbacks): Promise<boolean> {
    try {
      this.config = config;
      this.callbacks = callbacks;

      // Socket.IO bağlantısı
      this.socket = io(config.serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.setupSocketListeners();
      
      // Yerel medya akışını başlat
      await this.startLocalStream();

      // Odaya katıl
      this.socket.emit('join-room', {
        roomId: config.roomId,
        userId: config.userId,
        userName: config.userName,
        userRole: config.userRole,
      });

      return true;
    } catch (error) {
      console.error('Video conference initialization error:', error);
      this.callbacks?.onError(`Bağlantı hatası: ${error}`);
      return false;
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.callbacks?.onConnectionStateChange('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.callbacks?.onConnectionStateChange('disconnected');
    });

    this.socket.on('user-joined', async (data: { userId: string; userName: string; userRole: string }) => {
      console.log('User joined:', data);
      await this.createPeerConnection(data.userId, data.userName, data.userRole as 'teacher' | 'student');
    });

    this.socket.on('user-left', (data: { userId: string }) => {
      console.log('User left:', data.userId);
      this.removeParticipant(data.userId);
    });

    this.socket.on('offer', async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      await this.handleOffer(data.from, data.offer);
    });

    this.socket.on('answer', async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      await this.handleAnswer(data.from, data.offer);
    });

    this.socket.on('ice-candidate', async (data: { from: string; candidate: RTCIceCandidateInit }) => {
      await this.handleIceCandidate(data.from, data.candidate);
    });

    this.socket.on('message', (data: { from: string; text: string; timestamp: number }) => {
      this.callbacks?.onMessage(data);
    });

    this.socket.on('participants-update', (participants: Participant[]) => {
      this.updateParticipants(participants);
    });
  }

  private async startLocalStream(): Promise<void> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      };

      this.localStream = await mediaDevices.getUserMedia(constraints);
      console.log('Local stream started');
    } catch (error) {
      console.error('Error starting local stream:', error);
      throw new Error('Kamera ve mikrofon erişimi gerekli');
    }
  }

  private async createPeerConnection(userId: string, userName: string, userRole: 'teacher' | 'student'): Promise<void> {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });

      // Yerel akışı ekle
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, this.localStream!);
        });
      }

      // ICE candidate handler
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.socket) {
          this.socket.emit('ice-candidate', {
            to: userId,
            candidate: event.candidate,
          });
        }
      };

      // Remote stream handler
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        this.updateParticipantStream(userId, remoteStream);
      };

      // Connection state handler
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${userId}:`, peerConnection.connectionState);
      };

      this.peerConnections.set(userId, peerConnection);

      // Offer oluştur
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (this.socket) {
        this.socket.emit('offer', {
          to: userId,
          offer: offer,
        });
      }
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  }

  private async handleOffer(from: string, offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      let peerConnection = this.peerConnections.get(from);
      
      if (!peerConnection) {
        // Yeni peer connection oluştur
        peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
          ],
        });

        // Yerel akışı ekle
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            peerConnection!.addTrack(track, this.localStream!);
          });
        }

        // Event handlers
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && this.socket) {
            this.socket.emit('ice-candidate', {
              to: from,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.ontrack = (event) => {
          const remoteStream = event.streams[0];
          this.updateParticipantStream(from, remoteStream);
        };

        this.peerConnections.set(from, peerConnection);
      }

      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (this.socket) {
        this.socket.emit('answer', {
          to: from,
          answer: answer,
        });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer(from: string, answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(from);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleIceCandidate(from: string, candidate: RTCIceCandidateInit): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(from);
      if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  private updateParticipantStream(userId: string, stream: MediaStream): void {
    const participant = this.participants.get(userId);
    if (participant) {
      participant.stream = stream;
      this.participants.set(userId, participant);
      this.notifyParticipantsUpdate();
    }
  }

  private updateParticipants(participants: Participant[]): void {
    this.participants.clear();
    participants.forEach(participant => {
      this.participants.set(participant.id, participant);
    });
    this.notifyParticipantsUpdate();
  }

  private notifyParticipantsUpdate(): void {
    const participantsArray = Array.from(this.participants.values());
    this.callbacks?.onParticipantsUpdate(participantsArray);
  }

  private removeParticipant(userId: string): void {
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }
    this.participants.delete(userId);
    this.notifyParticipantsUpdate();
  }

  // Public methods
  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }
    return false;
  }

  async toggleAudio(): Promise<boolean> {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return audioTrack.enabled;
    }
    return false;
  }

  async startScreenShare(): Promise<boolean> {
    try {
      const screenStream = await mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Mevcut video track'i değiştir
      const videoTrack = screenStream.getVideoTracks()[0];
      if (this.localStream) {
        const sender = this.localStream.getVideoTracks()[0];
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }

      return true;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return false;
    }
  }

  async stopScreenShare(): Promise<boolean> {
    try {
      // Normal kamera akışına geri dön
      const cameraStream = await mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      if (this.localStream) {
        const sender = this.localStream.getVideoTracks()[0];
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }

      return true;
    } catch (error) {
      console.error('Error stopping screen share:', error);
      return false;
    }
  }

  sendMessage(message: string): void {
    if (this.socket && this.config) {
      this.socket.emit('message', {
        roomId: this.config.roomId,
        text: message,
        timestamp: Date.now(),
      });
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  async disconnect(): Promise<void> {
    // Tüm peer connection'ları kapat
    this.peerConnections.forEach(peerConnection => {
      peerConnection.close();
    });
    this.peerConnections.clear();

    // Yerel akışı durdur
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    // Socket bağlantısını kapat
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.participants.clear();
    this.callbacks?.onConnectionStateChange('disconnected');
  }
}

// Singleton instance
export const videoConferenceService = new VideoConferenceService();
