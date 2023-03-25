import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import AllJobsSection from '../AllJobsSection'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileLoad: false,
    userData: [],
    radioIp: '',
    search: '',
    checkList: [],
    activeCategoryId: '',
  }

  componentDidMount() {
    this.getUser()
  }

  getUser = async () => {
    this.setState({profileLoad: true})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const profileData = await response.json()
      const data = profileData.profile_details

      const updatedData = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }

      this.setState({userData: updatedData, profileLoad: false})
    } else {
      this.setState({profileLoad: false})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderUser = () => {
    const {userData} = this.state

    return userData ? (
      <div className="user-info-container">
        <img src={userData.profileImageUrl} alt="profile" />
        <h1>{userData.name}</h1>
        <p className="bio">{userData.shortBio}</p>
      </div>
    ) : (
      <div className="failed-user">
        <button type="button" onClick={this.getUser}>
          Retry
        </button>
      </div>
    )
  }

  onChangeRadio = event => {
    this.setState({radioIp: event.target.value})
  }

  onCheck = event => {
    const {checkList} = this.state
    const option = event.target.value
    const updatedCheck = [...checkList, option]
    const string = updatedCheck.join(',')
    this.setState({activeCategoryId: string, checkList: updatedCheck})
  }

  onSearch = event => {
    this.setState({search: event.target.value})
  }

  render() {
    const {profileLoad, radioIp, activeCategoryId, search} = this.state

    return (
      <>
        <Header />
        <div className="jobs-bg">
          <div>
            <div className="search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={search}
                onChange={this.onSearch}
              />
              <button type="button" data-testid="searchButton">
                <BsSearch className="search-icon" />
              </button>
            </div>
            {profileLoad ? this.renderLoader() : this.renderUser()}
          </div>
          <hr />
          <div className="employ-options">
            <h3>Type of Employment</h3>
            <ul>
              {employmentTypesList.map(each => (
                <li>
                  <input
                    type="checkBox"
                    id={each.employmentTypeId}
                    onChange={this.onCheck}
                    value={each.employmentTypeId}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  <br />
                  <br />
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className="employ-options">
            <h3>Salary Range</h3>
            <ul>
              {salaryRangesList.map(each => (
                <li>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    name="radioButton"
                    value={each.salaryRangeId}
                    onChange={this.onChangeRadio}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  <br />
                  <br />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <AllJobsSection
              radio={radioIp}
              check={activeCategoryId}
              search={search}
            />
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
