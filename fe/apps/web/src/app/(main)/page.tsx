import { PositionIcon } from '@/assets/Icons'
import { Blogs } from '@/constants'
import { Button } from '@heroui/button'
import { Card } from '@heroui/card'
import { Image } from '@heroui/image'
import InputContainer from '@/components/landing-page/InputContainer'
import { getTranslations } from 'next-intl/server'
import Footer from '@/components/layout/Footer'

const Home = async () => {
  const t = await getTranslations('HomePage')
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <main className="flex flex-col items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center space-y-12">
          {/* Hero Section */}
          <section className="flex flex-col justify-center max-h-[920px] min-h-[400px] h-[80svh]">
            <div className="flex flex-col items-center justify-center opacity-100 transition-opacity duration-300 gap-10">
              <div className="mb-6">
                <h1 className="mb-6 text-center text-6xl font-black">
                  {t('slogan')}
                </h1>
                <p className="text-center text-base font-normal">
                  {t('description')}
                </p>
              </div>

              {/* Input Container */}
              <InputContainer />
            </div>
          </section>

          {/* Featured Content Grid */}
          <section className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Our Product
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Discover the latest innovations and features that make our
              solution the best choice for your needs
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="h-128 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                <Image src="https://images.unsplash.com/photo-1533228359762-1d3346e1c50a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              </Card>
              <div className="py-5">
                <div className="text-5xl font-semibold">Auto Planning</div>
                <p className="font-normal mt-2 text-gray-600">
                  Auto planning uses AI to generate personalized travel
                  itineraries in seconds. Instead of manually searching and
                  piecing together activities, restaurants, and routes, users
                  simply provide preferences (budget, interests, travel dates).
                  The system then creates a day-by-day plan optimized for
                  convenience, timing, and local experiences.
                </p>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <Image
                    className="object-cover w-full h-full"
                    src="https://plus.unsplash.com/premium_photo-1663076518116-0f0637626edf?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </Card>
                <div className="py-2">
                  <div className="text-xl font-semibold">Auto Booking</div>
                  <p className="font-normal text-sm mt-2 text-gray-600">
                    Auto booking connects the planned itinerary directly with
                    booking services. Once a user finalizes their plan, the
                    system automatically finds and reserves flights, hotels,
                    attractions, and transport that match the itinerary.
                  </p>
                </div>
              </div>
              <div>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <Image
                    className="object-cover w-full h-full"
                    src="https://plus.unsplash.com/premium_photo-1663099990889-10a861e6aa96?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </Card>
                <div className="py-2">
                  <div className="text-xl font-semibold">Group Planning</div>
                  <p className="font-normal text-sm mt-2 text-gray-600">
                    Group planning allows friends, families, or colleagues to
                    plan trips together in a collaborative way. Members can
                    suggest destinations, vote on activities, and track shared
                    budgets. The system ensures everyone’s preferences are
                    considered and merges them into one optimized group
                    itinerary.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest News Section */}
          <div className="space-y-6 mt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Pre Planned</h2>
              <Button variant="light" size="sm">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* {[1, 2, 3].map((index) => (
                    <div key={index}>
                      <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                        <Image
                          className="object-cover w-[410px] h-[200px]"
                          src="https://images.unsplash.com/photo-1533228359762-1d3346e1c50a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        />
                      </Card>
                      <div className="py-2">
                        <div className="text-xl font-semibold">
                          GPT-5 is here
                        </div>
                        <p className="font-semibold text-sm">Release</p>
                      </div>
                    </div>
                  ))} */}

              <div>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <Image
                    className="object-cover w-[410px] h-[200px]"
                    src="https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </Card>
                <div className="py-2">
                  <div className="text-xl font-semibold">
                    3-day trip on Paris
                  </div>
                  <p className="font-normal text-[14px]">
                    {' '}
                    Eiffel Tower • Louvre Museum • Arc de Triomphe
                  </p>
                  <p className="font-normal text-sm text-gray-600 flex items-center">
                    <span>
                      <PositionIcon />
                    </span>
                    Paris
                  </p>
                </div>
              </div>
              <div>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <Image
                    className="object-cover w-[410px] h-[200px]"
                    src="https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?q=80&w=2086&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </Card>
                <div className="py-2">
                  <div className="text-xl font-semibold">
                    Peony Cruise 3 Days/2 Nights
                  </div>
                  <p className="font-normal text-[14px]">
                    {' '}
                    Hanoi • Ha Long Bay
                  </p>
                  <p className="font-normal text-sm text-gray-600 flex items-center">
                    <span>
                      <PositionIcon />
                    </span>
                    Viet Nam, Ha Long Bay
                  </p>
                </div>
              </div>
              <div>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <Image
                    className="object-cover w-[410px] h-[200px]"
                    src="https://images.unsplash.com/photo-1710267411914-31241d8ad993?q=80&w=678&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </Card>
                <div className="py-2">
                  <div className="text-xl font-semibold">
                    3-day trip to Da Nang
                  </div>
                  <p className="font-normal text-[14px]"> Hanoi • Danang</p>
                  <p className="font-normal text-sm text-gray-600 flex items-center">
                    <span>
                      <PositionIcon />
                    </span>
                    Viet Nam, Da Nang City
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Cards Section */}
          <div className="space-y-6 mt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-black">Latest news</h2>
              <Button variant="light" size="sm" className="text-black">
                View all
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {Blogs.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 group cursor-pointer"
                  >
                    <img
                      src={item.imagePath}
                      alt=""
                      className="w-46 h-46 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative flex items-center justify-center"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold  mb-2 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm ">
                        <span className="font-medium">
                          {item.location?.city}
                        </span>
                        <span className="text-gray-600">
                          {item.publishDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {Blogs.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 group cursor-pointer"
                  >
                    <img
                      src={item.imagePath}
                      alt=""
                      className="w-46 h-46 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative flex items-center justify-center"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold  mb-2 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm ">
                        <span className="font-medium">
                          {item.location?.city}
                        </span>
                        <span>{item.publishDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
