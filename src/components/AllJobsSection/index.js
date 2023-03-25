import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      productsList: [],
      apiStatus: apiStatusConstants.initial,

      searchInput: '',
      activeCategoryId: '',
      activeRatingId: '',
    }
  }

  componentDidMount() {
    this.changeRating()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(this.props)
    const {activeCategoryId, searchInput, activeRatingId} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeRatingId}&minimum_package=${activeCategoryId}&search=${searchInput}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobby = fetchedData.jobs

      const updatedData = jobby.map(product => ({
        id: product.id,
        companyLogoUrl: product.company_logo_url,
        employmentType: product.employment_type,
        jobDescription: product.job_description,
        location: product.location,
        packagePerAnnum: product.package_per_annum,
        rating: product.rating,
        title: product.title,
      }))

      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getProducts}>
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {productsList} = this.state
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {productsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  clearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  changeRating = () => {
    const {radio, check, search} = this.props
    this.setState(
      {activeRatingId: radio, searchInput: search, activeCategoryId: check},
      this.getProducts,
    )
  }

  render() {
    /* const {activeCategoryId, searchInput, activeRatingId} = this.state */
    console.log(this.props)
    return (
      <div className="all-products-section">{this.renderAllProducts()}</div>
    )
  }
}

export default AllJobsSection
