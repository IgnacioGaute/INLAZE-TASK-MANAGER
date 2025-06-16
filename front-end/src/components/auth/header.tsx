

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
