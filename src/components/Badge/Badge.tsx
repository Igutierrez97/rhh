export default function Badge({ content }: { content: string }) {
    return (
      <div className={`badge ${content === 'PENDIENTE' ? 'badge-warning' : 'badge-success'} gap-2`}>
        {content}
      </div>
    );
  }
  