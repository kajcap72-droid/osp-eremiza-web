import React from 'react';
import { mockStatystyki } from '../data/mockData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Table } from 'lucide-react';

export const ExportStats: React.FC = () => {
  const exportToCSV = () => {
    const stats = mockStatystyki.roczne;
    
    // CSV content
    let csv = 'Statystyki OSP e-Remiza\n';
    csv += `Rok,${stats.rok}\n`;
    csv += `Alarmów łącznie,${stats.alarmyRazem}\n`;
    csv += `Średni czas zadysponowania,${stats.sredniCzasZadysponowania}s\n\n`;
    
    csv += 'Typ alarmu,Liczba\n';
    Object.entries(stats.wgTypu).forEach(([typ, count]) => {
      csv += `${typ},${count}\n`;
    });
    
    csv += '\nMiesiąc,Alarmy\n';
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    stats.wgMiesiaca.forEach((count, i) => {
      csv += `${months[i]},${count}\n`;
    });
    
    csv += '\nTop Druhowie\n';
    csv += 'Imię i Nazwisko,Alarmy,Średni czas reakcji\n';
    stats.topDruhowie.forEach(d => {
      csv += `${d.imieNazwisko},${d.liczbaAlarmow},${d.sredniCzasReakcji}s\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `statystyki-osp-${stats.rok}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const stats = mockStatystyki.roczne;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(220, 38, 38);
    doc.text('Statystyki OSP e-Remiza', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rok: ${stats.rok}`, 105, 30, { align: 'center' });
    
    // Summary
    doc.setFontSize(11);
    doc.text(`Alarmów łącznie: ${stats.alarmyRazem}`, 20, 45);
    doc.text(`Średni czas zadysponowania: ${Math.floor(stats.sredniCzasZadysponowania / 60)}m ${stats.sredniCzasZadysponowania % 60}s`, 20, 52);
    
    // Table: Alarmy wg typu
    autoTable(doc, {
      startY: 65,
      head: [['Typ alarmu', 'Liczba']],
      body: Object.entries(stats.wgTypu).map(([typ, count]) => [typ, count.toString()]),
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Table: Alarmy wg miesiąca
    const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Miesiąc', 'Alarmy']],
      body: stats.wgMiesiaca.map((count, i) => [months[i], count.toString()]),
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Table: Top Druhowie
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Imię i Nazwisko', 'Alarmy', 'Śr. czas reakcji']],
      body: stats.topDruhowie.map(d => [
        d.imieNazwisko,
        d.liczbaAlarmow.toString(),
        `${d.sredniCzasReakcji}s`
      ]),
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Wygenerowano: ${new Date().toLocaleString('pl-PL')} | Strona ${i} z ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }
    
    // Download
    doc.save(`statystyki-osp-${stats.rok}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-1.5 px-3 py-2 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-all text-xs font-semibold"
      >
        <Table className="w-4 h-4" />
        CSV
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-1.5 px-3 py-2 bg-red-900/30 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-all text-xs font-semibold"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
    </div>
  );
};
