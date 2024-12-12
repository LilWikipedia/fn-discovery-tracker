import ExperienceGrid from "@/components/ExperienceGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted py-4">
        <div className="container">
          <h1 className="text-2xl font-bold text-primary">FN Discovery</h1>
          <p className="text-muted-foreground">Track and analyze experiences in real-time</p>
        </div>
      </header>
      <main className="py-8">
        <ExperienceGrid />
      </main>
    </div>
  );
};

export default Index;