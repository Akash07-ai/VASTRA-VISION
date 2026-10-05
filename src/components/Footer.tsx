export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-lg text-gold">VASTRA VISION</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ivory/70">
            Frontend prototype - real ML inference not connected. Demo values are deterministic and isolated in
            service functions for future Python/PyTorch integration.
          </p>
        </div>
        <div className="text-sm leading-6 text-ivory/70 md:text-right">
          <p>POST /predict, POST /verify, and GET /gallery ready for backend replacement.</p>
        </div>
      </div>
    </footer>
  );
}
