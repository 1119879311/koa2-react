import React, { Component } from 'react'
import AddEditAddArticle from './AddEditAddArticle'

export default class index extends Component {


  render(){
    return (
      <div className="addarticle-view">
         <AddEditAddArticle {...this.props}/>
      </div>
    )
  }
}