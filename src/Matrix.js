import React from 'react';
import PropTypes from 'prop-types';


class Matrix extends React.PureComponent {

    state = {
        data: {

        }
    }

    getSizeValue = (number) => {
        const { size } = this.props;
        let result = "";
        for(let i = 0; i< number; i++){
            result = `${result} ${size}`;
        }
        return result.trim();
    }

    onChange = (e) => {
        const {rows, columns, onChange} = this.props;
        let { data } = this.state;
        data[e.target.name] = parseInt(e.target.value);
        this.setState({data});
        if(Object.keys(data).length === (rows * columns)){
            onChange(this.toMatrix(Object.values(data)));
        }
    }

    toMatrix = (array) => {
        const { columns } = this.props;
        let result = [];
        let column = [];
    
        array.forEach(x => {
            if(column.length >= columns){
                result = [...result, column];
                column = [];
            }
            column = [...column, x];
        });
        if(column.length > 0 ){
            result = [...result, column ];
        }
        return result;
    }

    _renderInput = (item, index) => {
        const { disabled, data } = this.props;
        const style = data.length ? {
            borderColor: '#e83e8c',
            color: '#e83e8c',
            textAlign: 'center'
        } : undefined;
        return(
            <input
                style={style}
                size={data.length ? item.toString().length : undefined} 
                defaultValue={data.length ? item : ''} 
                onChange={this.onChange} 
                key={`item_${index}`} 
                type={'number'} 
                name={index} 
                disabled={disabled}
            />
        );
    }

    render(){
        const { rows, columns, data } = this.props;

        const arrayWillRender = data.length ? data : Array( rows * columns ).fill(0);
       
        return(
            <div style={{display: 'grid', gridTemplateColumns: this.getSizeValue(columns), gridTemplateRows: this.getSizeValue(rows) }}>
                {arrayWillRender.map(this._renderInput) }
            </div>
        );
    }
}

Matrix.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    data: PropTypes.array
};

Matrix.defaultProps = {
    rows: 0,
    columns: 0,
    size: `45px`,
    disabled: false,
    onChange: () => {},
    data: []
}

export default Matrix;