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
import { Tooltip } from '@heroui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RightSideBarContentWrapper from './RightSideBarContentWrapper'

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
    <aside
      className={`shadow p-4 transition-all duration-300 ease-in-out overflow-hidden mt-4 mb-4 rounded-l-3xl
        ${isCollapsed ? 'w-[clamp(400px,50vw,800px)] max-w-[800px] ' : 'w-16'}`}
    >
      <nav
        className={`flex ${isCollapsed ? 'gap-5 flex-row' : 'flex-col gap-4'}`}
      >
        {!isCollapsed ? (
          // collapsed view
          <div className="grid justify-center gap-8">
            {/* <SearchIcon
              className="w-5 h-5 cursor-pointer"
              onClick={handleToggle}
            /> */}
            <Tooltip content="Map" placement="left" showArrow={true}>
              <MapIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  handleToggle()
                  handleState('Map')
                }}
              />
            </Tooltip>
            <Tooltip content="Itineraries" placement="left" showArrow={true}>
              <ItineraryIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  handleToggle()
                  handleState('Itineraries')
                }}
              />
            </Tooltip>
            <Tooltip content="Hotels" placement="left" showArrow={true}>
              <HotelIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  handleToggle()
                  handleState('Hotels')
                }}
              />
            </Tooltip>
            <Tooltip content="Flights" placement="left" showArrow={true}>
              <PaperFlightIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  handleToggle()
                  handleState('Flights')
                }}
              />
            </Tooltip>
          </div>
        ) : (
          // expanded view
          <>
            <div className="w-full">
              <div className=" flex justify-between items-center">
                <div className="flex gap-5 flex-row py-3">
                  <div
                    className={`shadow rounded-2xl p-3 cursor-pointer ${activeRightSideBarItem === 'Map' ? 'bg-black' : 'transition hover:scale-105'}`}
                    onClick={() => handleState('Map')}
                  >
                    <MapIcon
                      className={`w-5 h-5 ${activeRightSideBarItem === 'Map' ? 'text-white' : ''}`}
                    />
                  </div>
                  <div
                    className={`shadow rounded-2xl p-3 cursor-pointer ${activeRightSideBarItem === 'Itineraries' ? 'bg-black' : 'transition hover:scale-105'}`}
                    onClick={() => handleState('Itineraries')}
                  >
                    <ItineraryIcon
                      className={`w-5 h-5 ${activeRightSideBarItem === 'Itineraries' ? 'text-white' : ''}`}
                    />
                  </div>
                  <div
                    className={`shadow rounded-2xl p-3 cursor-pointer ${activeRightSideBarItem === 'Hotels' ? 'bg-black' : 'transition hover:scale-105'}`}
                    onClick={() => handleState('Hotels')}
                  >
                    <HotelIcon
                      className={`w-5 h-5 ${activeRightSideBarItem === 'Hotels' ? 'text-white' : ''}`}
                    />
                  </div>
                  <div
                    className={`shadow rounded-2xl p-3 cursor-pointer ${activeRightSideBarItem === 'Flights' ? 'bg-black' : 'transition hover:scale-105'}`}
                    onClick={() => handleState('Flights')}
                  >
                    <PaperFlightIcon
                      className={`w-5 h-5 ${activeRightSideBarItem === 'Flights' ? 'text-white' : ''}`}
                    />
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={() => {
                      handleToggle()
                    }}
                  >
                    <CollapseIcon className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {isCollapsed && (
        <div className="rounded-2xl p-2 no-scrollbar overflow-auto h-full">
          <RightSideBarContentWrapper />
        </div>
      )}
    </aside>
  )
}

export default RightSideBar
