import React from 'react';
import GridTable from './DynamicGrid';
import {cloneDeep} from "@babel/types";
import './styles.css';

const defaultList = [
  {
    version: '4.0',
    status: 'in-progress',
    progress: '-',
    startDate: '1993-07-19',
    releaseDate: '1993-07-19',
    description: 'Awesome..',
    children: [
      {
        status: 'in-progress',
        progress: 40,
        startDate: '1993-07-19',
        releaseDate: '1993-07-19',
        description: 'Awesome..',
      },
      {
        status: 'in-progress',
        progress: 30,
        startDate: '1993-07-19',
        releaseDate: '1993-07-19',
        description: 'Awesome..',
      }
    ]
  },
  {
    version: '5.0',
    status: 'in-progress',
    progress: '-',
    startDate: '1993-07-19',
    releaseDate: '1993-07-19',
    description: 'Awesome..',
    children: [
      {
        status: 'in-progress',
        progress: 20,
        startDate: '1993-07-19',
        releaseDate: '1993-07-19',
        description: 'Awesome..',
      }
    ]
  },

]

export default class Dashboard extends React.Component {
  isEdit = false;
  editId = -1;
  arrayData = [];
  taskIndex = -1;
  constructor(props) {
    super(props);
    this.state = {
      versionForm: this.initVersionData(),
      formData: defaultList,
      errorMsg: '',
      isVersionDisabled: false
    }
    this.getFileObj();
  }

  initVersionData = () => {
    return {
      version: '',
      status: 'unreleased',
      progress: 0,
      startDate: '',
      releaseDate: '',
      description: '',
      children: []
    }
  }

  taskCompleted = (data, pindex, cindex) =>{
    const updateTask = this.state.formData;
    updateTask[pindex].children[cindex] = data;
    updateTask[pindex].children[cindex].status = 'Released';
    var value = updateTask[pindex].children.reduce((a, b) => a + b.progress, 0);
    value = (value / (updateTask[pindex].children.length)) || 0;
    if(value == 100){
      updateTask[pindex].status = 'released';
    } else {
      updateTask[pindex].status = 'In-progress';
    }

    this.setState({formData: updateTask});
  }


  handleSubmit = () => {
    const {versionForm} = this.state
    if(this.taskIndex >-1 && this.state.isVersionDisabled){

      this.addVersionTask();
    } else {
      if(!this.isEdit){
        if(versionForm.version && versionForm.status && versionForm.description){
          this.arrayData = [...this.arrayData, this.state.versionForm]
          this.setState({formData: [...this.state.formData, this.state.versionForm], versionForm: this.initVersionData(),errorMsg: ''})
        }
        else {
          this.setState({errorMsg: 'Please Fill all Value'})
        }

      }
      else {
        if(versionForm.version && versionForm.status && versionForm.description){
          const editedArray = this.state.formData;
          editedArray[this.editId] = versionForm;

          this.setState({formData: editedArray, versionForm: this.initVersionData(),errorMsg: ''})
          this.arrayData = editedArray;
          this.isEdit = false;
        }
        else {
          this.setState({errorMsg: 'Please Fill all Value'})
        }
      }
    }


    console.log(this.state.formData);
  }

  addVersionTask = () =>{
    ;
    const {versionForm} = this.state
    const editedArray = this.state.formData;
    const { version, ...newObject } = versionForm;
    editedArray[this.taskIndex].children.push(newObject);

    this.setState({formData: editedArray, versionForm: this.initVersionData(),errorMsg: '', isVersionDisabled: false})
    this.arrayData = editedArray;
  }

  handleChange = (e) => {
    const data = e.target;
    this.setState({versionForm: {...this.state.versionForm, [data.name]: data.value}});
  }

  searchData = (searchedKeyword) => {
    const newArray = this.arrayData;
    if(!newArray) this.setState({formData: []});
    if(!searchedKeyword) this.setState({formData: this.arrayData});
    if(searchedKeyword) {
      const res = newArray.filter((x,i)=> x.name.toLowerCase().includes(searchedKeyword) || x.address.toLowerCase().includes(searchedKeyword));
      this.setState({formData: res})
    }


  }

  getFileObj = () => {
    const file = 'https://www.gstatic.com/webp/gallery3/1.png';

    fetch('https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg')
        .then(res => {
              return res.blob()
            }
        ) // Gets the response and returns it as a blob
        .then(blob => {
          let objectURL = URL.createObjectURL(blob);
          let myImage = new Image();
          myImage.src = objectURL;
          // document.getElementById('myImg').appendChild(myImage)
        });
  }

  childHandler = (data, index, type) => {
    this.editId = index;
    if(type && type === 'edit'){
      this.isEdit = true;
      this.setState({versionForm: data, isVersionDisabled: false});
    } else if( type === 'addTask'){
      this.isEdit = false;
      this.taskIndex = index;
      this.setState({
        isVersionDisabled: true
      })
    } else {
      this.isEdit = false;
      const deletedArr = this.state.formData;
      deletedArr.splice(this.editId, 1);
      this.setState({formData: deletedArr, isVersionDisabled: false});
    }

    console.log(data);
  }

  addTask = (index) => {
    this.taskIndex = index;
    this.setState({
      isVersionDisabled: true
    })
  }

  _onFocus = (e) =>{
    e.currentTarget.type = "date";
  }

  _onBlur = (e) => {
    e.currentTarget.type = "text";
  }



  render() {
    const {versionForm} = this.state;
    return (
        <div>


          <div>
            <h5>Releases</h5>
            <GridTable data={this.state.formData} action={this.childHandler} handleSearch={this.searchData}
                       addTask={this.addTask}
                       taskCompleted = {this.taskCompleted}
            />
          </div>
          <div className={'col-sm-12 dynamic-form'}>
            <div className={'form-group col-sm-2'}>
              <input className={'form-control'} type = 'text' name = 'version' value = {versionForm.version} onChange={this.handleChange} placeholder={'Version name'} disabled={this.state.isVersionDisabled}/>
            </div>
            <div className={'form-group col-sm-3 mr-2'}>
              <input className={'form-control'} id="date" type = 'text' onFocus = {this._onFocus} onBlur={this._onBlur} name = 'startDate' value={versionForm.startDate} onChange={this.handleChange} placeholder={'Start Date'}/>
            </div>
            <div className={'form-group col-sm-3 mr-2'}>
              <input className={'form-control'} id="dates" type = 'text' onFocus = {this._onFocus} onBlur={this._onBlur} name = 'releaseDate' value={versionForm.releaseDate} onChange={this.handleChange} placeholder={'Release Date'}/>
            </div>
            <div className={'form-group col-sm-2 mr-2'}>
              <textarea className={'form-control'} rows="1" name ="description" value={versionForm.description} onChange={this.handleChange} placeholder={'Description'}></textarea>
            </div>
            <div className={'text-danger'}>{this.state.errorMsg}</div>
            <div>
              <button className={'btn btn-primary'} onClick={this.handleSubmit}>Add</button>
            </div>
          </div>
        </div>


    );

  }
}
