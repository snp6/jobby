import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsBag, BsBoxArrowUpRight} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    skills: [],
    life: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getSkillData = skill => ({
    imageUrl: skill.image_url,
    name: skill.name,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const details = fetchedData.job_details
      console.log(fetchedData)
      const skillData = details.skills
      const lifeData = details.life_at_company
      const updatedLife = {
        description: lifeData.description,
        imageUrl: lifeData.image_url,
      }
      const updatedData = {
        companyLogoUrl: details.company_logo_url,
        companyWebsiteUrl: details.company_website_url,
        employmentType: details.employment_type,
        id: details.id,
        jobDescription: details.job_description,
        location: details.location,
        packagePerAnnum: details.package_per_annum,
        rating: details.rating,
        title: details.title,
      }
      const updatedSkills = skillData.map(each => this.getSkillData(each))
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedData(eachSimilarJob),
      )
      this.setState({
        productData: updatedData,
        skills: updatedSkills,
        life: updatedLife,
        similarProductsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops!Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>

        <button type="button" className="button" onClick={this.getProductData}>
          Retry
        </button>
      </div>
    </>
  )

  renderProductDetailsView = () => {
    const {productData, skills, life, similarProductsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = productData

    return (
      <div className="bg">
        <div className="job-list-container">
          <div className="row-container">
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
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
          <a href={companyWebsiteUrl}>
            Visit
            <BsBoxArrowUpRight />
          </a>
          <p>{jobDescription}</p>
          <h4>Skills</h4>
          <ul className="skill-container">
            {skills.map(each => (
              <li className="skill-content" key={each.name}>
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h4>Life at Company</h4>
          <p>{life.description}</p>
          <img
            src={life.imageUrl}
            alt="
            life
            at
            company"
            className="life-image"
          />
        </div>
        <h1 className="similar">Similar Jobs</h1>
        <ul>
          {similarProductsData.map(each => (
            <li className="job-list-container" key={each.id}>
              <div className="row-container">
                <div>
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                  />
                </div>
                <div className="col-container">
                  <h3 className="title">{each.title}</h3>
                  <div className="row-container">
                    <BsFillStarFill className="star" />
                    <p>{each.rating}</p>
                  </div>
                </div>
              </div>

              <h4>Description</h4>
              <p>{each.jobDescription}</p>
              <div className="row-container salary">
                <div className="row-container places">
                  <div className="row-container spl">
                    <GoLocation className="icon" />
                    <p>{each.location}</p>
                  </div>
                  <div className="row-container">
                    <BsBag className="icon" />
                    <p>{each.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
