import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-zinc-200 bg-white", className)}>
      <Container className="flex min-h-16 items-center justify-between gap-4 py-4 text-sm text-zinc-600">
        <p>{siteConfig.name}</p>
        <p>{siteConfig.environment}</p>
      </Container>
    </footer>
  );
}
