export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="page-header__layout">
        <h1>{title}</h1>
        <div className="page-header__summary">
          {description ? <p>{description}</p> : null}
          {meta ? <div className="page-header__meta">{meta}</div> : null}
        </div>
      </div>
    </header>
  );
}

