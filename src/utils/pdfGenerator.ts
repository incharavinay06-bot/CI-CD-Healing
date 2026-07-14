import { jsPDF } from 'jspdf';
import { HealingSession } from '../types';

export function generatePDFReport(session: HealingSession) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let y = 20;

  // Header helper for auto-paginating
  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > 275) {
      doc.addPage();
      y = 20;
      
      // Page running header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('HEALER.AI - Autonomous Healing Audit Report', 20, 10);
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.line(20, 12, 190, 12);
      doc.setTextColor(30, 41, 59); // slate-800
    }
  };

  // Plain text wrapped drawer
  const drawText = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal', color: [number, number, number] = [30, 41, 59]) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, 170);
    const lineHeight = fontSize * 0.45 + 1; // standard spacing
    checkNewPage(lines.length * lineHeight);
    lines.forEach((line: string) => {
      doc.text(line, 20, y);
      y += lineHeight;
    });
    y += 2;
  };

  // Draw solid dark header banner on cover/first page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(20, 15, 170, 26, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('HEALER.AI • AUTONOMOUS DEVOPS REPORT', 26, 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Autonomous Pipeline Self-Healing Audit Trail', 26, 32);

  y = 52;

  // Labeled Metadata grid
  const drawMetaLine = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(label + ':', 20, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    const wrappedVal = doc.splitTextToSize(value, 115);
    wrappedVal.forEach((line: string, idx: number) => {
      doc.text(line, 68, y);
      if (idx < wrappedVal.length - 1) y += 5;
    });
    y += 6.5;
  };

  drawText('SESSION LOGISTICS', 11, 'bold', [15, 23, 42]);
  y += 2;
  
  drawMetaLine('Session ID', session.id);
  drawMetaLine('Created Timestamp', session.createdAt);
  drawMetaLine('Target Repository', session.repoUrl || 'N/A (Local Sandbox)');
  drawMetaLine('Assigned Team', `${session.teamName} (Leader: ${session.leaderName})`);
  drawMetaLine('Healed Branch', session.branchName);
  drawMetaLine('Pipeline Status', session.status.toUpperCase());
  y += 4;

  // Metrics Highlight Box
  checkNewPage(38);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(20, y, 170, 32, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('ERRORS DETECTED', 25, y + 8);
  doc.text('ERRORS HEALED', 68, y + 8);
  doc.text('SUCCESS RATE', 110, y + 8);
  doc.text('INTEGRITY SCORE', 150, y + 8);

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`${session.metrics.errorsDetected}`, 25, y + 18);
  doc.text(`${session.metrics.errorsFixed}`, 68, y + 18);
  doc.text(`${session.metrics.successRate}%`, 110, y + 18);
  doc.text(`${session.metrics.overallScore}/100`, 150, y + 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Healing iterations used: ${session.metrics.iterationsUsed}`, 25, y + 26);
  y += 38;

  // Title for Directory of errors and fixes
  drawText('ERROR & RESOLUTION DIRECTORY', 11, 'bold', [15, 23, 42]);
  y += 2;

  // Custom table layout widths (sum to 170mm)
  const colWidths = [40, 18, 56, 56];
  const colPositions = [20, 60, 78, 134];

  const drawTableRow = (cols: string[], styles: ('normal' | 'bold')[], bgFill?: [number, number, number]) => {
    // split columns into wrapped lines
    const colLines = cols.map((text, i) => doc.splitTextToSize(text || '', colWidths[i] - 5)); // padding
    const maxLines = Math.max(...colLines.map(l => l.length));
    const rowHeight = maxLines * 4.2 + 5; // spacing + padding

    checkNewPage(rowHeight);

    // Render background
    if (bgFill) {
      doc.setFillColor(bgFill[0], bgFill[1], bgFill[2]);
      doc.rect(20, y, 170, rowHeight, 'F');
    }

    // Render borders
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.rect(20, y, 170, rowHeight, 'S');

    // Render text cell contents
    colLines.forEach((lines, colIdx) => {
      doc.setFont('helvetica', styles[colIdx] || 'normal');
      doc.setFontSize(8.5);
      if (bgFill) {
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setTextColor(30, 41, 59);
      }

      lines.forEach((line: string, lineIdx: number) => {
        doc.text(line, colPositions[colIdx] + 2.5, y + 4.2 * lineIdx + 4.5);
      });
    });

    y += rowHeight;
  };

  // Draw Table Headers
  drawTableRow(
    ['Where (File Path)', 'Severity', 'Exactly What the Error Was', 'What Fix Was Applied'],
    ['bold', 'bold', 'bold', 'bold'],
    [15, 23, 42] // deep dark header
  );

  // Draw Table Rows
  if (session.appliedFixes.length === 0) {
    drawTableRow(
      ['N/A', 'N/A', 'No defects or exceptions were detected in the codebase.', 'Workspace is fully clean.'],
      ['normal', 'normal', 'normal', 'normal']
    );
  } else {
    session.appliedFixes.forEach((fix) => {
      const resolvedSev = fix.severity || 'Warning';
      drawTableRow(
        [fix.fileName, resolvedSev, fix.originalIssue, fix.fixApplied],
        ['bold', 'bold', 'normal', 'normal']
      );
    });
  }
  y += 8;

  // Timeline Audit list
  drawText('PIPELINE TIMELINE AUDIT TRAIL', 11, 'bold', [15, 23, 42]);
  y += 2;

  session.timeline.forEach((step) => {
    const statusStr = step.status.toUpperCase();
    const detailText = `${step.title}: ${step.description}`;

    checkNewPage(8);

    // Status Bullet tag colors
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (step.status === 'completed') {
      doc.setTextColor(16, 185, 129); // emerald green
    } else if (step.status === 'running') {
      doc.setTextColor(99, 102, 241); // indigo
    } else if (step.status === 'failed') {
      doc.setTextColor(239, 68, 68); // rose
    } else {
      doc.setTextColor(100, 116, 139); // slate-500
    }

    doc.text(`[${statusStr}]`, 20, y);

    // Step descriptions
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85); // slate-700
    const lines = doc.splitTextToSize(detailText, 138);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, 48, y);
      if (idx < lines.length - 1) {
        y += 4.5;
        checkNewPage(5);
      }
    });
    y += 5.5;
  });

  y += 8;
  drawText('Report generated autonomously by Healer.AI DevOps Agent. Confidential - For internal verification audits.', 7.5, 'italic', [148, 163, 184]);

  // Save report
  doc.save(`healer_report_${session.id}.pdf`);
}
