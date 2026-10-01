import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center pt-24">
      <div className="container-x text-center">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="display mt-4 text-h2">
          This path <span className="text-gradient">isn&apos;t automated yet.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex justify-center">
          <Button href="/" arrow>
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
