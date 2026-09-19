'use client';

import React from 'react';

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={index}>{part}</React.Fragment>
  ));
}

export default function RichArticleContent({ content }) {
  const lines = String(content || '').replace(/\\n/g, '\n').split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: [...list] });
      list = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
    } else if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2));
    } else if (line.startsWith('### ')) {
      flushParagraph(); flushList(); blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flushParagraph(); flushList(); blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('# ')) {
      flushParagraph(); flushList(); blocks.push({ type: 'h2', text: line.slice(2) });
    } else {
      flushList();
      paragraph.push(line);
    }
  });
  flushParagraph();
  flushList();

  return (
    <div className="rich-article-content">
      {blocks.map((block, index) => {
        if (block.type === 'h2') return <h2 key={index}>{renderInline(block.text)}</h2>;
        if (block.type === 'h3') return <h3 key={index}>{renderInline(block.text)}</h3>;
        if (block.type === 'ul') {
          return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>;
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
