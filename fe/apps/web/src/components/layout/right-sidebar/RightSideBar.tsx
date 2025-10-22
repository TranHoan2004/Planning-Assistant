'use client'

import {
  CollapseIcon,
  HotelIcon,
  ItineraryIcon,
  MapIcon,
  PaperFlightIcon,
  SearchIcon
} from '@/assets/Icons'
import {
  setActiveRightBarItem,
  setIsCollapsed
} from '@/state/rightsidebar-slice'
import { RootState } from '@/state/store'
import { Tooltip } from '@heroui/tooltip'
import { Button } from '@heroui/button'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RightSideBarContentWrapper from './RightSideBarContentWrapper'
import { cn } from '@repo/utils/tailwind-utils'

const RightSideBar = () => {
  const activeRightSideBarItem = useSelector(
    (state: RootState) => state.rightsidebar.activeRightBarItem
  )
  const isCollapsed = useSelector(
    (state: RootState) => state.rightsidebar.isCollapsed
  )
  const dispatch = useDispatch()

  const handleToggle = () => {
    dispatch(setIsCollapsed(!isCollapsed))
  }

  const handleState = (item: 'Hotels' | 'Map' | 'Itineraries' | 'Flights') => {
    dispatch(setActiveRightBarItem(item))
  }

  return (
    <>
      {/* Overlay - only visible on md+ screens when sidebar is expanded */}
      {!isCollapsed && (
        <div
          className="block md:hidden fixed inset-0 bg-black/40 z-10"
          onClick={handleToggle}
        />
      )}

      <aside
        className={cn(
          'md:p-4 md:pr-0 transition-all duration-500 ease-in-out bg-white',
          // Desktop styles (md and above)
          'md:relative md:overflow-hidden md:h-full md:rounded-t-0',
          !isCollapsed ? 'lg:w-1/2' : 'lg:w-20',
          // Mobile styles (below md) - always fixed at bottom
          'fixed md:relative bottom-0 left-0 right-0 p-0 rounded-t-3xl',
          // Mobile height
          !isCollapsed ? 'h-[90vh]' : 'h-16',
          // Z-index: higher on desktop when expanded to be above overlay
          'z-20'
        )}
      >
        <div
          className={cn(
            'p-4 md:shadow-lg ring-1 ring-neutral-100 rounded-t-3xl md:rounded-l-3xl md:rounded-t-none h-full md:h-full md:overflow-y-auto'
          )}
        >
          <div
            className={cn(
              'flex',
              !isCollapsed
                ? 'gap-5 flex-col md:flex-row'
                : 'flex-row md:flex-col gap-4'
            )}
          >
            {isCollapsed ? (
              // collapsed view
              <nav
                className={cn(
                  'grid gap-4',
                  'grid-flow-col md:grid-flow-row',
                  'justify-center w-full md:w-auto'
                )}
              >
                <Tooltip content="Map" placement="left" showArrow={true}>
                  <Button
                    isIconOnly
                    variant="light"
                    radius="lg"
                    onPress={() => {
                      handleToggle()
                      handleState('Map')
                    }}
                  >
                    <MapIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip
                  content="Itineraries"
                  placement="left"
                  showArrow={true}
                >
                  <Button
                    isIconOnly
                    variant="light"
                    radius="lg"
                    onPress={() => {
                      handleToggle()
                      handleState('Itineraries')
                    }}
                  >
                    <ItineraryIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip content="Hotels" placement="left" showArrow={true}>
                  <Button
                    isIconOnly
                    variant="light"
                    radius="lg"
                    onPress={() => {
                      handleToggle()
                      handleState('Hotels')
                    }}
                  >
                    <HotelIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip content="Flights" placement="left" showArrow={true}>
                  <Button
                    isIconOnly
                    variant="light"
                    radius="lg"
                    onPress={() => {
                      handleToggle()
                      handleState('Flights')
                    }}
                  >
                    <PaperFlightIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              </nav>
            ) : (
              // expanded view
              <>
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <nav className="flex gap-5 flex-row py-3 group">
                      <Button
                        data-active={activeRightSideBarItem === 'Map'}
                        isIconOnly
                        variant="solid"
                        radius="lg"
                        onPress={() => {
                          handleState('Map')
                        }}
                        className="bg-background shadow-md data-[active=true]:bg-black data-[active=true]:text-white"
                      >
                        <MapIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        data-active={activeRightSideBarItem === 'Itineraries'}
                        isIconOnly
                        variant="solid"
                        radius="lg"
                        onPress={() => {
                          handleState('Itineraries')
                        }}
                        className="bg-background shadow-md data-[active=true]:bg-black data-[active=true]:text-white"
                      >
                        <ItineraryIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        data-active={activeRightSideBarItem === 'Hotels'}
                        isIconOnly
                        variant="solid"
                        radius="lg"
                        onPress={() => {
                          handleState('Hotels')
                        }}
                        className="bg-background shadow-md data-[active=true]:bg-black data-[active=true]:text-white"
                      >
                        <HotelIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        data-active={activeRightSideBarItem === 'Flights'}
                        isIconOnly
                        variant="solid"
                        radius="lg"
                        onPress={() => {
                          handleState('Flights')
                        }}
                        className="bg-background shadow-md data-[active=true]:bg-black data-[active=true]:text-white"
                      >
                        <PaperFlightIcon className="w-5 h-5" />
                      </Button>
                    </nav>
                    <Button
                      variant="light"
                      isIconOnly
                      radius="full"
                      onPress={() => {
                        handleToggle()
                      }}
                    >
                      <CollapseIcon className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isCollapsed && (
            <div className={cn('no-scrollbar h-full overflow-y-auto md:h-fit')}>
              <RightSideBarContentWrapper />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default RightSideBar
