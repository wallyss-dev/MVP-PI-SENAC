export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatTime(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
    planejada: 'Planejada',
    cancelada: 'Cancelada',
  };
  return labels[status] || status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    em_andamento: 'bg-amber-100 text-amber-800 border-amber-200',
    concluida: 'bg-green-100 text-green-800 border-green-200',
    planejada: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelada: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max) + '...';
}
