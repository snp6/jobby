import {Link} from 'react-router-dom'
import {BsFillStarFill, BsBag} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'

import './index.css'

const JobCard = props => {
  const {jobData, click} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  const onPress = () => click(id)

  return (
    <Link to={`/jobs/${id}`}>
      <li onClick={onPress} className="job-list-container">
        <div>
          <div className="row-container">
            <div>
              <img src={companyLogoUrl} alt={title} />
            </div>
            <div className="col-container">
              <h3 className="title">{title}</h3>
              <div className="row-container">
                <BsFillStarFill className="star" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="row-container salary">
            <div className="row-container places">
              <div className="row-container spl">
                <GoLocation className="icon" />
                <p>{location}</p>
              </div>
              <div className="row-container">
                <BsBag className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>

            <p className="pack">{packagePerAnnum}</p>
          </div>
          <hr />
          <h4>Description</h4>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
