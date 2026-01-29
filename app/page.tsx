import { HomeExperience } from '@/components/home/HomeExperience'
import { LandingGate } from '@/components/landing'

export default function HomePage() {
  return (
    <LandingGate>
      <main>
        <HomeExperience />
      </main>
    </LandingGate>
  )
}
