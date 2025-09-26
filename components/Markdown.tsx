import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

type Props = { content: string };

// Minimal markdown renderer: headings, bold, lists, paragraphs, blockquote, links
export function Markdown({ content }: Props) {
  const lines = content.split(/\n\n+/);
  return (
    <View style={styles.container}>
      {lines.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading ###
        if (/^###\s+/.test(trimmed)) {
          const text = trimmed.replace(/^###\s+/, '');
          return (
            <Text key={i} style={styles.h3}>{text}</Text>
          );
        }

        // Blockquote
        if (/^>\s?/.test(trimmed)) {
          const text = trimmed.replace(/^>\s?/, '');
          return (
            <View key={i} style={styles.quote}>
              <Text style={styles.quoteText}>{text}</Text>
            </View>
          );
        }

        // List
        if (/^(?:-|\d+\.)\s+/.test(trimmed)) {
          const items = trimmed.split(/\n/);
          return (
            <View key={i} style={styles.list}>
              {items.map((li, idx) => {
                const label = /^\d+\./.test(li) ? li.match(/^(\d+)\./)?.[1] + '.' : '•';
                const text = li.replace(/^(?:-|\d+\.)\s+/, '');
                return (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bullet}>{label}</Text>
                    <Text style={styles.p}>{formatInline(text)}</Text>
                  </View>
                );
              })}
            </View>
          );
        }

        // Paragraph with inline bold and links
        return <Text key={i} style={styles.p}>{formatInline(trimmed)}</Text>;
      })}
    </View>
  );
}

function formatInline(text: string) {
  // bold **text** and links [text](url)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  // Simple parser loop for **bold** and [link](url)
  const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<Text key={parts.length} style={styles.bold}>{match[1]}</Text>);
    } else if (match[2] && match[3]) {
      const url = match[3];
      parts.push(
        <Text key={parts.length} style={styles.link} onPress={() => Linking.openURL(url)}>
          {match[2]}
        </Text>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return <Text>{parts}</Text>;
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: '800',
  },
  p: {
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
  link: {
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    width: 16,
    textAlign: 'right',
  },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: '#e2e8f0',
    paddingLeft: 10,
  },
  quoteText: {
    fontStyle: 'italic',
  },
});

export default Markdown;


