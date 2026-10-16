import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import Platform from '@/components/home/Platform'
import Labs from '@/components/home/Labs'
import Work from '@/components/home/Work'
import Testimonials from '@/components/home/Testimonials'
import Faq from '@/components/home/Faq'
import Contact from '@/components/home/Contact'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Platform />
      <Labs />
      <Work />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </>
  )
}
