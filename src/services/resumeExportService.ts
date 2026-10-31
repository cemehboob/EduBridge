/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Professional PDF and Word (.DOC) Export Service for Regional Resumes & CVs
 */

import { EnhancedResumeData, CVRegionPattern } from '../types/career';

export class ResumeExportService {
  /**
   * Generates a printable, styled HTML document tailored to the selected region
   * and opens the browser's native Print to PDF dialog.
   */
  public static exportToPDF(resume: EnhancedResumeData): void {
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Please allow popups to download or print your PDF CV.');
      return;
    }

    const htmlContent = this.generateRegionalHtml(resume, 'pdf');
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * Generates the complete HTML string for the Word document (.doc).
   */
  public static generateWordHtml(resume: EnhancedResumeData): string {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${this.escapeHtml(resume.fullName)} - ${resume.targetRegion} CV</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Calibri, 'Segoe UI', Arial, sans-serif;
            color: #0f172a;
            line-height: 1.5;
            padding: 20px;
          }
          h1 { color: #1e1b4b; font-size: 24pt; margin: 0 0 4pt 0; text-transform: uppercase; }
          h2 { color: #4338ca; font-size: 13pt; margin: 12pt 0 4pt 0; border-bottom: 1.5pt solid #4338ca; padding-bottom: 2pt; text-transform: uppercase; }
          h3 { color: #1e293b; font-size: 11pt; margin: 6pt 0 2pt 0; font-weight: bold; }
          p, li { font-size: 10pt; color: #334155; }
          .contact-bar { font-size: 9.5pt; color: #475569; margin-bottom: 12pt; border-bottom: 1pt solid #cbd5e1; padding-bottom: 6pt; }
          .skill-tag { display: inline-block; background: #f1f5f9; padding: 2pt 6pt; margin: 2pt; border-radius: 3pt; font-size: 9pt; }
        </style>
      </head>
      <body>
        ${this.generateWordBody(resume)}
      </body>
      </html>
    `;
  }

  /**
   * Downloads the complete formatted CV/Resume as a Microsoft Word document (.doc).
   */
  public static exportToWord(resume: EnhancedResumeData): void {
    if (typeof window === 'undefined') return;

    const safeName = resume.fullName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_${resume.targetRegion}_CV_${Date.now()}.doc`;
    const mimeType = 'application/msword;charset=utf-8';
    const wordHtml = this.generateWordHtml(resume);

    const blob = new Blob([wordHtml], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static generateWordBody(resume: EnhancedResumeData): string {
    const photoHtml = resume.showPhoto && resume.photoUrl
      ? `<div style="float: right; margin-left: 15px; margin-bottom: 10px;">
           <img src="${resume.photoUrl}" width="110" height="110" style="border-radius: ${resume.photoShape === 'circle' ? '50%' : '6px'}; border: 1px solid #cbd5e1;" />
         </div>`
      : '';

    const regionalTitle =
      resume.targetRegion === 'US'
        ? 'RESUME'
        : resume.targetRegion === 'Europe'
        ? 'EUROPASS CURRICULUM VITAE'
        : 'CURRICULUM VITAE';

    return `
      ${photoHtml}
      <div style="font-size: 10pt; font-weight: bold; color: #4338ca; letter-spacing: 1.5px;">${regionalTitle}</div>
      <h1>${this.escapeHtml(resume.fullName)}</h1>
      <p style="font-size: 12pt; color: #4f46e5; font-weight: bold; margin-top: 0;">${this.escapeHtml(resume.headline)}</p>
      
      <div class="contact-bar">
        ${this.escapeHtml(resume.location)} | ${this.escapeHtml(resume.phone)} | ${this.escapeHtml(resume.email)}
        ${resume.linkedin ? ` | ${this.escapeHtml(resume.linkedin)}` : ''}
        ${resume.github ? ` | ${this.escapeHtml(resume.github)}` : ''}
        ${resume.nationality ? ` | Nationality: ${this.escapeHtml(resume.nationality)}` : ''}
        ${resume.visaStatus ? ` | Visa: ${this.escapeHtml(resume.visaStatus)}` : ''}
      </div>

      <h2>Executive Profile</h2>
      <p>${this.escapeHtml(resume.summary)}</p>

      <h2>Core Competencies &amp; Technical Skills</h2>
      <p>${resume.skills.map(s => `<span class="skill-tag">${this.escapeHtml(s)}</span>`).join(' • ')}</p>

      <h2>Professional Experience</h2>
      ${resume.experiences.map(exp => `
        <div>
          <table width="100%" style="margin-bottom: 2pt;">
            <tr>
              <td align="left"><strong>${this.escapeHtml(exp.role)}</strong> · <span style="color: #475569;">${this.escapeHtml(exp.company)}</span></td>
              <td align="right" style="color: #64748b; font-size: 9pt;">${this.escapeHtml(exp.period)}</td>
            </tr>
          </table>
          <ul>
            ${exp.achievements.map(a => `<li>${this.escapeHtml(a)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}

      <h2>Education &amp; Academic Qualifications</h2>
      ${resume.education.map(ed => `
        <table width="100%" style="margin-bottom: 4pt;">
          <tr>
            <td align="left"><strong>${this.escapeHtml(ed.degree)}</strong></td>
            <td align="right" style="color: #64748b; font-size: 9pt;">${this.escapeHtml(ed.year)}</td>
          </tr>
          <tr>
            <td colspan="2" style="color: #475569; font-size: 9.5pt;">${this.escapeHtml(ed.institution)} · ${this.escapeHtml(ed.location || '')} ${ed.honors ? `(${this.escapeHtml(ed.honors)})` : ''}</td>
          </tr>
        </table>
      `).join('')}

      ${resume.projects && resume.projects.length > 0 ? `
        <h2>Key Engineering Projects &amp; Deliverables</h2>
        ${resume.projects.map(p => `
          <div>
            <strong>${this.escapeHtml(p.title)}</strong> ${p.link ? `<span style="color: #4f46e5; font-size: 9pt;">[${this.escapeHtml(p.link)}]</span>` : ''}
            <p style="margin-top: 2pt; margin-bottom: 6pt;">${this.escapeHtml(p.description)}</p>
          </div>
        `).join('')}
      ` : ''}

      ${resume.languages && resume.languages.length > 0 ? `
        <h2>Language Proficiency</h2>
        <p>${resume.languages.map(l => `<strong>${this.escapeHtml(l.language)}:</strong> ${this.escapeHtml(l.proficiency)} ${l.cefrLevel ? `(CEFR ${l.cefrLevel})` : ''}`).join(' | ')}</p>
      ` : ''}

      ${resume.verifiedCertificates && resume.verifiedCertificates.length > 0 ? `
        <h2>Verified Certifications</h2>
        ${resume.verifiedCertificates.map(c => `
          <p style="margin-bottom: 4pt;">
            <strong>${this.escapeHtml(c.title)}</strong> — ${this.escapeHtml(c.issuer)} (${this.escapeHtml(c.issuedDate)})
            <span style="color: #4338ca; font-size: 8.5pt; font-family: monospace;">[ID: ${this.escapeHtml(c.credentialId)}]</span>
          </p>
        `).join('')}
      ` : ''}

      ${resume.referencesStatement ? `
        <h2>References</h2>
        <p><em>${this.escapeHtml(resume.referencesStatement)}</em></p>
      ` : ''}
    `;
  }

  public static generateRegionalHtml(resume: EnhancedResumeData, mode: 'pdf' | 'view'): string {
    const isUS = resume.targetRegion === 'US';
    const isEU = resume.targetRegion === 'Europe';
    const isUK = resume.targetRegion === 'UK';
    const isGulf = resume.targetRegion === 'Gulf';

    const documentTitle = isUS
      ? 'Resume'
      : isEU
      ? 'Europass Curriculum Vitae'
      : isUK
      ? 'Curriculum Vitae'
      : `${resume.targetRegion} Curriculum Vitae`;

    const photoBorderRadius =
      resume.photoShape === 'circle'
        ? '50%'
        : resume.photoShape === 'rounded'
        ? '12px'
        : '2px';

    const photoHtml = resume.showPhoto && resume.photoUrl
      ? `<div class="photo-container">
           <img src="${resume.photoUrl}" alt="${this.escapeHtml(resume.fullName)}" style="border-radius: ${photoBorderRadius}; width: 110px; height: 110px; object-fit: cover; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" />
         </div>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${this.escapeHtml(resume.fullName)} - ${documentTitle}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            line-height: 1.5;
            margin: 0;
            padding: 24px;
            background: #ffffff;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 16px;
            margin-bottom: 18px;
          }
          .title-area {
            flex: 1;
          }
          .doc-type {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #4f46e5;
          }
          h1 {
            font-size: 26px;
            font-weight: 900;
            margin: 2px 0 4px 0;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .headline {
            font-size: 13px;
            font-weight: 700;
            color: #4338ca;
            margin-bottom: 8px;
          }
          .contact-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 11px;
            color: #475569;
          }
          .contact-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1e1b4b;
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 4px;
            margin-top: 16px;
            margin-bottom: 10px;
          }
          p, li {
            font-size: 11.5px;
            color: #334155;
            line-height: 1.6;
          }
          ul {
            margin: 4px 0 8px 0;
            padding-left: 18px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: 12px;
            margin-bottom: 2px;
          }
          .role-title {
            font-weight: 800;
            color: #0f172a;
          }
          .company-name {
            font-weight: 600;
            color: #475569;
          }
          .period {
            font-size: 11px;
            font-family: monospace;
            color: #64748b;
          }
          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .skill-badge {
            background: #f1f5f9;
            color: #1e293b;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            border: 1px solid #e2e8f0;
          }
          .cert-badge {
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: #faf5ff;
            margin-bottom: 6px;
          }
          .print-footer {
            margin-top: 24px;
            padding-top: 8px;
            border-top: 1px solid #f1f5f9;
            font-size: 9px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-row">
          <div class="title-area">
            <span class="doc-type">${documentTitle}</span>
            <h1>${this.escapeHtml(resume.fullName)}</h1>
            <div class="headline">${this.escapeHtml(resume.headline)}</div>
            <div class="contact-pills">
              <span class="contact-item">📍 ${this.escapeHtml(resume.location)}</span>
              <span class="contact-item">📞 ${this.escapeHtml(resume.phone)}</span>
              <span class="contact-item">✉️ ${this.escapeHtml(resume.email)}</span>
              ${resume.linkedin ? `<span class="contact-item">🔗 ${this.escapeHtml(resume.linkedin)}</span>` : ''}
              ${resume.github ? `<span class="contact-item">💻 ${this.escapeHtml(resume.github)}</span>` : ''}
              ${resume.nationality ? `<span class="contact-item">🌐 ${this.escapeHtml(resume.nationality)}</span>` : ''}
            </div>
          </div>
          ${photoHtml}
        </div>

        <div class="section-title">Professional Profile</div>
        <p>${this.escapeHtml(resume.summary)}</p>

        <div class="section-title">Core Competencies &amp; Technical Skills</div>
        <div class="skills-grid">
          ${resume.skills.map(s => `<span class="skill-badge">${this.escapeHtml(s)}</span>`).join('')}
        </div>

        <div class="section-title">Professional Experience</div>
        ${resume.experiences.map(exp => `
          <div style="margin-bottom: 12px;">
            <div class="item-header">
              <div>
                <span class="role-title">${this.escapeHtml(exp.role)}</span> · 
                <span class="company-name">${this.escapeHtml(exp.company)}</span>
                ${exp.location ? `<span style="font-size: 10px; color: #94a3b8;">(${this.escapeHtml(exp.location)})</span>` : ''}
              </div>
              <span class="period">${this.escapeHtml(exp.period)}</span>
            </div>
            <ul>
              ${exp.achievements.map(a => `<li>${this.escapeHtml(a)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="section-title">Education &amp; Qualifications</div>
        ${resume.education.map(ed => `
          <div style="margin-bottom: 8px;">
            <div class="item-header">
              <span class="role-title">${this.escapeHtml(ed.degree)}</span>
              <span class="period">${this.escapeHtml(ed.year)}</span>
            </div>
            <div style="font-size: 11px; color: #475569;">
              ${this.escapeHtml(ed.institution)} · ${this.escapeHtml(ed.location || '')}
              ${ed.honors ? ` — <em>${this.escapeHtml(ed.honors)}</em>` : ''}
            </div>
          </div>
        `).join('')}

        ${resume.projects && resume.projects.length > 0 ? `
          <div class="section-title">Key Projects &amp; Deliverables</div>
          ${resume.projects.map(p => `
            <div style="margin-bottom: 8px;">
              <div class="item-header">
                <span class="role-title">${this.escapeHtml(p.title)}</span>
                ${p.link ? `<span class="period">${this.escapeHtml(p.link)}</span>` : ''}
              </div>
              <p style="margin: 2px 0;">${this.escapeHtml(p.description)}</p>
              ${p.techStack ? `<div style="font-size: 10px; color: #64748b;">Tech Stack: ${this.escapeHtml(p.techStack.join(', '))}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${resume.languages && resume.languages.length > 0 ? `
          <div class="section-title">Languages (${isEU ? 'CEFR Framework' : 'Proficiency'})</div>
          <div class="skills-grid">
            ${resume.languages.map(l => `
              <span class="skill-badge">
                <strong>${this.escapeHtml(l.language)}:</strong> ${this.escapeHtml(l.proficiency)} ${l.cefrLevel ? `(${l.cefrLevel})` : ''}
              </span>
            `).join('')}
          </div>
        ` : ''}

        ${resume.verifiedCertificates && resume.verifiedCertificates.length > 0 ? `
          <div class="section-title">Verified Certifications &amp; Credentials</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${resume.verifiedCertificates.map(c => `
              <div class="cert-badge">
                <strong style="color: #1e1b4b; font-size: 11px; display: block;">${this.escapeHtml(c.title)}</strong>
                <span style="color: #64748b; font-size: 10px; display: block;">${this.escapeHtml(c.issuer)} · ${this.escapeHtml(c.issuedDate)}</span>
                <span style="font-family: monospace; font-size: 9px; color: #4f46e5;">ID: ${this.escapeHtml(c.credentialId)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.referencesStatement ? `
          <div class="section-title">References</div>
          <p style="font-style: italic;">${this.escapeHtml(resume.referencesStatement)}</p>
        ` : ''}

        <div class="print-footer">
          <span>EduBridge Verified Portfolio · Generated for ${this.escapeHtml(resume.targetRegion)} Format</span>
          <span>Verified ID: EB-PORTFOLIO-${Date.now().toString().slice(-6)}</span>
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
