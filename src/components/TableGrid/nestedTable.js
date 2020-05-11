import React from 'react';

class NestedGridTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
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
        // keys.push('Action');
        return keys.map((key, index) => {
            return <th key={key}>{key}</th>;
        });

    }


    getRowData = () => {
        const items = this.props.data;
        const keys = this.getKeys();
        if(!items) { return null; }
        return items.map((row,index)=>{
            return <tr key={index+2}>

                {this.renderRow(row, keys, index)}

                <td><button onClick={() => this.props.TaskCompleted(row,this.props.parentIdx, index)} className={'btn btn-sm btn-primary'}>Release</button></td>
            </tr>

        })
    }

    renderRow = (data, keys, idx) => {
        return keys.map((val, index) => {
            return <td key={val}>{data[val]}</td>
        })
    }

    handleSearch = (e) => {
        this.props.handleSearch(e.target.value.toLowerCase());
    }

    getTable = () => {
        return (
            <div>
                <div className={'table-responsive-sm'}>
                    <table className="table table-bordered table-dark">
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

export default NestedGridTable;

