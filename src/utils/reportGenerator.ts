// src/utils/reportGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateWardReport = (ward: any) => {
  const doc = new jsPDF();

  // --- 1. Header Design ---
  doc.setFillColor(15, 23, 42); // Navy Blue background
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Delhi FloodWatch Intelligence", 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  doc.text("Ward-Level Situation Report", 14, 30);
  
  // --- 2. Ward Info ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text(`Ward Report: ${ward.name}`, 14, 55);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Location: ${ward.lat}, ${ward.lng} | Population: ${ward.population || 'N/A'}`, 14, 62);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 68);

  // --- 3. Risk Badge ---
  const riskColor = ward.currentRisk === 'critical' ? [239, 68, 68] : 
                    ward.currentRisk === 'high' ? [249, 115, 22] : 
                    ward.currentRisk === 'moderate' ? [234, 179, 8] : [34, 197, 94];
  
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(160, 50, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text((ward.currentRisk || 'LOW').toUpperCase(), 166, 58);

  // --- 4. Data Table ---
  const tableData = [
    ['Metric', 'Value', 'Status'],
    ['Current Rainfall', `${ward.currentRainfall || 0} mm/hr`, (ward.currentRainfall > 50) ? 'High' : 'Normal'],
    ['Drain Capacity', `${ward.drainCapacity || 0}%`, (ward.drainCapacity < 30) ? 'Critical' : 'Good'],
    ['Active Incidents', `${ward.activeIncidents || 0}`, (ward.activeIncidents > 0) ? 'Active' : 'Clear'],
    ['Last Flood Event', ward.lastFlood || '-', '-'],
    ['Historical Total', `${ward.historicalIncidents || 0}`, '-']
  ];

  autoTable(doc, {
    startY: 80,
    head: [['Metric', 'Value', 'Status']],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("System Generated Report - Delhi FloodWatch", 14, 280);

  doc.save(`${ward.name}_FloodRisk_Report.pdf`);
};