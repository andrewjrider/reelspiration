import ChallengePicker from "@/components/ChallengePicker";
import AtmosphericBand from "@/components/AtmosphericBand";

export default function ChallengesIndex() {
  return (
    <div>
      <AtmosphericBand src="/atmosphere/petrified-forest-rocks.png" scrim="heavy">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
            Start Here
          </p>
          <h1 className="font-serif text-4xl text-paper max-w-xl leading-tight">
            Six kinds of proof.
          </h1>
          <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
            Every story in this library turns on a moment most people
            assumed was the ending. Pick the kind you want to read.
          </p>
        </div>
      </AtmosphericBand>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <ChallengePicker />
      </div>
    </div>
  );
}
