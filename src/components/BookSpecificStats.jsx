import React from 'react'
import '../bookspecificstats.css'
import {ReactComponent as StarIcon} from '../star_icon.svg'
import {ReactComponent as Package} from '../package.svg'
import {ReactComponent as CrateDrop} from '../crate_drop.svg'
import {ReactComponent as CrateTruck} from '../crate_truck.svg'

function BookSpecificStats() {

  return (
    <div className="book_specific_statistics_container">

        <div className="book_specific_header">
            Reading Progress
        </div>
        <div className="book_specific_subheader">
            Statistics
        </div>

        <div className="book_flex">
            <div className="book_specific_graph">

            </div>
            <div className="book_specific_circle_graph">

            </div>
        </div>

        <div className="milestone_container">

            <div className="milestone_real_container">
            
                <div className="book_specific_header">
                    <StarIcon /> Rewards Milestone
                </div>
                <div className="book_specific_subheader" style={{marginLeft: '45px', marginBottom: '40px'}}>
                    2 out of 4 rewards
                </div>

                <div className="progress_bar_container">
                    <div className="progress_bar">
                        <div className="package_container_1">
                                <Package />
                                <div className="percentage_read_text">
                                    25% Read
                                </div>
                                <div className="tier_text">
                                    Tier I
                                </div>
                        </div>
                        <div className="package_container_2">
                                <Package />
                                <div className="percentage_read_text">
                                    50% Read
                                </div>
                                <div className="tier_text">
                                    Tier II
                                </div>
                        </div>
                        <div className="package_container_3">
                                <CrateDrop />
                        </div>
                        <div className="package_container_4">
                                <CrateTruck />
                        </div>

                    </div>
                </div>

            </div>


        </div>

    </div>
  )
}

export default BookSpecificStats