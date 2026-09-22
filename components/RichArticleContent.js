'use client';

import React from 'react';

function getLinkLabel(href) {
  try {
    const url = new URL(href);
    if (url.hostname.includes('jobstreet.com') || url.hostname.includes('linkedin.com')) return 'Klik untuk melamar';
    if (url.hostname === 'www.bekasikerja.id' && url.pathname.startsWith('/ump/')) return 'Lihat sumber data';
    if (url.hostname.endsWith('bekasikerja.id')) return 'Buka tautan terkait';
  } catch {
    // Keep a safe fallback for malformed URLs; href is still validated by the protocol check.
  }
  return 'Buka sumber';
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//i.test(part)) {
      const trailing = part.match(/[.,;:!?]+$/)?.[0] || '';
      const href = trailing ? part.slice(0, -trailing.length) : part;
      return (
        <React.Fragment key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="article-source-link"
          >
            {getLinkLabel(href)}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function RichArticleContent({ content, hideApplyLinks = false, hideSourceSection = false }) {
  let lines = String(content || '').replace(/\\+n/g, '\n').split(/\r?\n/);
  if (hideSourceSection) {
    const sourceIndex = lines.findIndex((line) => /^##\s+sumber\b/i.test(line.trim()));
    if (sourceIndex >= 0) lines = lines.slice(0, sourceIndex);
  }
  lines = lines.filter((line) => !(hideApplyLinks && /cara melamar:/i.test(line)));
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
