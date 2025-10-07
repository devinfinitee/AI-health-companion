import VoiceButton from '../VoiceButton';

export default function VoiceButtonExample() {
  return (
    <div className="flex items-center justify-center gap-8 p-8">
      <VoiceButton size="default" />
      <VoiceButton size="large" />
    </div>
  );
}
