import { ClosingSection } from '@/components/home/ClosingSection'
import { DifferenceSection } from '@/components/home/DifferenceSection'
import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSection } from '@/components/home/ProblemSection'
import { StepsSection } from '@/components/home/StepsSection'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle()

  return (
    <>
      <HeroSection />
      <StepsSection />
      <ProblemSection />
      <DifferenceSection />
      <ClosingSection />
    </>
  )
}
