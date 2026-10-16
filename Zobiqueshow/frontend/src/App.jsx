import Nav from './components/ui/Nav'
import Hero from './components/sections/Hero'
import Stats from './components/sections/Stats'
import Platform from './components/sections/Platform'
import Labs from './components/sections/Labs'
import Work from './components/sections/Work'
import { Testimonials, Faq, Contact, Footer } from './components/sections/Closing'

export default function App() {
  return (
    <>
      <Nav />
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
