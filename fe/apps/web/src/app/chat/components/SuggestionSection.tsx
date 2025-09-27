import CardFeature from '@/components/ui/CardFeature'

const SuggestionSection = () => {
  return (
    <div className=" flex flex-1 flex-col gap-7 bg-gray-50 p-6 overflow-y-auto rounded-[20px] no-scrollbar">
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-dark mb-4">
            For you in Ha Noi
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Get started
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            content="restaurant, hotel"
            href="#"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Get inspired</h2>
          <button className="text-sm text-gray-600 cursor-pointer">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            href="#"
          />

          <CardFeature
            image="https://images.unsplash.com/photo-1741795850743-798cdf152542?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            tag="300.000 vnd/day"
            title="ABC Hotel Ha Noi"
            href="#"
          />
        </div>
      </div>
    </div>
  )
}

export default SuggestionSection
