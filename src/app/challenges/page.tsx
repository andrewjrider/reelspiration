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
            What are you facing today?
          </h1>
          <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
            Every collection in this library is organized around a real moment,
            not a category. Choose the one that matches where you are.
          </p>
        </div>
      </AtmosphericBand>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <ChallengePicker />
      </div>
    </div>
  );
}
