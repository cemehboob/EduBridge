/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PDF and Document Export Service for EduBridge AI Question Solver
 * Allows students to export and download complete essays, full-text solutions,
 * step-by-step explanations, and key concepts as PDF, Word (.doc), or Text files.
 */

import { SolverResponse } from '../types/solver';

export class PDFExportService {
  /**
   * Generates a printable, styled HTML document and triggers native browser Print to PDF.
   */
  public static exportToPDF(solution: SolverResponse): void {
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Please allow popups to download or print your PDF.');
      return;
    }

    const stepsHtml = solution.steps
      .map(
        (step) => `
        <div style="margin-bottom: 18px; padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #4f46e5;">
          <h4 style="margin: 0 0 6px 0; color: #1e1b4b; font-size: 15px; font-weight: bold;">
            Step ${step.stepNumber}: ${this.escapeHtml(step.title)}
          </h4>
          <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.6;">
            ${this.escapeHtml(step.explanation)}
          </p>
          ${
            step.formulaOrCalculation
              ? `<div style="margin-top: 8px; padding: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace; font-size: 12px; color: #312e81;">
                  ${this.escapeHtml(step.formulaOrCalculation)}
                 </div>`
              : ''
          }
          ${
            step.intermediateResult
              ? `<div style="margin-top: 6px; font-size: 12px; font-weight: bold; color: #065f46;">
                  Intermediate Result: ${this.escapeHtml(step.intermediateResult)}
                 </div>`
              : ''
          }
        </div>
      `
      )
      .join('');

    const conceptsHtml = (solution.highlightedConcepts || [])
      .map(
        (c) => `
        <div style="margin-bottom: 8px; font-size: 13px;">
          <strong style="color: #1e293b;">${this.escapeHtml(c.term)}:</strong>
          <span style="color: #475569;">${this.escapeHtml(c.definition)}</span>
        </div>
      `
      )
      .join('');

    const formattedAnswer = solution.finalAnswer
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p style="margin-bottom: 12px; line-height: 1.7; font-size: 14px; color: #1e293b;">${this.escapeHtml(p)}</p>`)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>EduBridge Solution - ${this.escapeHtml(solution.topic || solution.subject)}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            line-height: 1.6;
            margin: 0;
            padding: 24px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 24px;
            font-weight: 900;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .brand-subtitle {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
          }
          .badge {
            display: inline-block;
            background: #ede9fe;
            color: #4338ca;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .question-box {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .answer-box {
            background: #ffffff;
            border: 2px solid #4f46e5;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 14px;
            margin-top: 24px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">EduBridge</div>
            <div class="brand-subtitle">AI-Powered Universal Question Solver &amp; Learning Workspace</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">${this.escapeHtml(solution.subject)}</span>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
              ${new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
          </div>
        </div>

        <div class="question-box">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">
            Problem / Question Prompt
          </div>
          <div style="font-size: 16px; font-weight: 800; color: #0f172a;">
            ${this.escapeHtml(solution.recognizedQuestion)}
          </div>
          <div style="font-size: 12px; color: #475569; margin-top: 4px;">
            Topic: ${this.escapeHtml(solution.topic)} · Level: ${this.escapeHtml(solution.difficulty)}
          </div>
        </div>

        <div class="answer-box">
          <div style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #4f46e5; margin-bottom: 8px;">
            Verified Complete Answer / Essay
          </div>
          ${formattedAnswer}
        </div>

        ${
          solution.steps.length > 0
            ? `<div class="section-title">Step-by-Step Explanation &amp; Logical Derivation</div>
               <div>${stepsHtml}</div>`
            : ''
        }

        ${
          solution.highlightedConcepts && solution.highlightedConcepts.length > 0
            ? `<div class="section-title">Important Concepts &amp; Key Definitions</div>
               <div>${conceptsHtml}</div>`
            : ''
        }

        <div class="footer">
          Generated with EduBridge AI Universal Problem Solver · Document ID: ${solution.id}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * Downloads the complete answer and explanation as a formatted text or Word (.doc) file.
   */
  public static exportToFile(solution: SolverResponse, format: 'doc' | 'txt' = 'doc'): void {
    if (typeof window === 'undefined') return;

    const safeTitle = (solution.topic || solution.subject || 'Solution')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const filename = `EduBridge_${safeTitle}_${Date.now()}.${format}`;

    let content = '';
    let mimeType = 'text/plain;charset=utf-8';

    if (format === 'doc') {
      mimeType = 'application/msword;charset=utf-8';
      content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>EduBridge Document</title></head>
        <body style="font-family: Calibri, Arial, sans-serif; padding: 20px;">
          <h1 style="color: #4f46e5; font-size: 22pt;">EduBridge Learning Workspace</h1>
          <p><strong>Subject:</strong> ${solution.subject} | <strong>Topic:</strong> ${solution.topic}</p>
          <hr/>
          <h2>Question / Prompt</h2>
          <p><strong>${solution.recognizedQuestion}</strong></p>
          <hr/>
          <h2 style="color: #4f46e5;">Complete Answer / Essay</h2>
          <div style="font-size: 12pt; line-height: 1.6;">
            ${solution.finalAnswer.replace(/\n/g, '<br/><br/>')}
          </div>
          <hr/>
          <h2>Step-by-Step Explanation</h2>
          ${solution.steps
            .map(
              (s) => `
            <h3>Step ${s.stepNumber}: ${s.title}</h3>
            <p>${s.explanation}</p>
            ${s.formulaOrCalculation ? `<pre>${s.formulaOrCalculation}</pre>` : ''}
          `
            )
            .join('')}
          <hr/>
          <p style="font-size: 9pt; color: #64748b;">Generated via EduBridge AI Universal Problem Solver.</p>
        </body>
        </html>
      `;
    } else {
      content = `==========================================================
EDUBRIDGE AI LEARNING WORKSPACE
Subject: ${solution.subject}
Topic: ${solution.topic}
Difficulty: ${solution.difficulty}
Date: ${new Date().toISOString()}
==========================================================

QUESTION / PROMPT:
${solution.recognizedQuestion}

----------------------------------------------------------
COMPLETE ANSWER / ESSAY:
----------------------------------------------------------
${solution.finalAnswer}

----------------------------------------------------------
STEP-BY-STEP EXPLANATION:
----------------------------------------------------------
${solution.steps
  .map(
    (s) => `Step ${s.stepNumber}: ${s.title}
${s.explanation}
${s.formulaOrCalculation ? `Calculation: ${s.formulaOrCalculation}` : ''}
${s.intermediateResult ? `Result: ${s.intermediateResult}` : ''}
`
  )
  .join('\n')}

----------------------------------------------------------
Generated by EduBridge AI Universal Question Solver
`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static escapeHtml(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
