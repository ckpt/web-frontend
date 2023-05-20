import MainLayout from '@/layouts/MainLayout'
import Greeting from '@/components/Greeting'
import RandomQuotes from '@/components/RandomQuotes'
import FrontButtons from '@/components/FrontButtons'

export default function Home() {
  return (
    <MainLayout>
      <FrontButtons />
      <Greeting />
      <RandomQuotes />
    </MainLayout>
  )
}
