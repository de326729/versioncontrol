import React from 'react';
import NestedGridTable from "./nestedTable";

class GridTable extends React.Component {
    isOpen = false;
    activeId = 0;
    constructor(props) {
        super(props);
        console.log(props);
    }

    state = {
        isOpen: false
    }

    getKeys = () => {
        const a = this.props.data.map(x=>{
            const { children, ...newObject } = x;
            return x = newObject;
        });
        const propsData = a;
        if(propsData && propsData.length> 0) {
            return Object.keys(propsData[0]);
        }
        return null;
    }

    getHeader = () => {
        let keys = [];
        keys = this.getKeys();
        if(!keys) {
            return [];
        }
        return keys.map((key, index) => {
            return <th key={key}>{key}</th>;
        });

    }


    isOpenData = (index) => {
        this.setState({isOpen: !this.state.isOpen})
        this.activeId = index;
    }

    getRowData = () => {
        const items = this.props.data;
        const keys = this.getKeys();
        if(!items) { return null; }
        return items.map((row,index)=>{
            return <><tr key={index+2} >

                {this.renderRow(row, keys, index)}

                <td><button onClick={() => this.props.action(row,index, 'addTask')} className={'btn btn-sm btn-primary'}>Add Task</button>
                    <button onClick={() => this.props.action(row,index, 'edit')} className={'btn btn-sm btn-primary'}>Edit</button>
                    <button onClick={() => this.props.action(row,index,'delete')} className={'btn btn-sm btn-danger'}>Delete</button>
                </td>
            </tr>
                { this.state.isOpen && this.activeId == index && <tr key={index}>
                    <td colspan = "7">
                    {row.children && row.children.length>0?
                        this.getChildTable(row.children, index)
                        :null}
                    </td>

                </tr>
                }
            </>
        })
    }

    renderRow = (data, keys, idx) => {
        return keys.map((val, index) => {
            return val !== 'progress' ? <td onClick={()=>this.isOpenData(idx)} key={val}>{data[val]}</td>:
                <td onClick={()=>this.isOpenData(idx)} key={val}>
                    <progress id="file" value={this.getProgressValue(data['children'], idx)} max="100">  </progress>
                    <span>{this.getProgressValue(data['children'])} %</span>
                </td>
        })
    }

    getProgressValue = (children = [], idx) => {
        var value = children.reduce((a, b) => a + b.progress, 0);
        value = (value / (children.length)) || 0;
        return value;
    }

    handleSearch = (e) => {
        this.props.handleSearch(e.target.value.toLowerCase());
    }

    getChildTable = (data, idx) =>{
        return <NestedGridTable data={data}
                                parentIdx = {idx}
                                action={this.childHandler}
                                TaskCompleted = {this.TaskCompleted}

        />
    }

    TaskCompleted = (data, pindex, childIndex) => {
        const datas = data;
        datas.progress = 100;
        this.props.taskCompleted(datas, pindex, childIndex);
    }

    getTable = () => {
        return (
            <div>

                <div className={'table-responsive-sm'}>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            {this.getHeader()}
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getRowData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }



    render() {
        return <div>{this.getTable()}</div>
    }
}

export default GridTable;

