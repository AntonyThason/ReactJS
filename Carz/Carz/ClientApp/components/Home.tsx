import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as carList from '../store/carList';

// At runtime, Redux will merge together...
type carListProps =
    carList.carList        // ... state we've requested from the Redux store
    & typeof carList.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class Home extends React.Component<carListProps, {}> {
    componentDidMount() {
        // This method runs when the component is first added to the page
        this.props.getCarList();
    }

    public render() {
        return <div>
            <h1>CAR LIST</h1>
            <button className="button-add" onClick={() => this.showNewCar('new')}>Add New</button>
            {this.renderCarList()}
            {
                this.props.mode == 'new' || this.props.mode == 'edit' ?
                    this.renderEditWindow() :
                    this.props.mode == 'view' ?
                        this.renderViewWindow() :
                        this.props.mode == 'delete' ?
                            this.renderDeleteWindow() :
                            null
            }
        </div>;
    }

    private onChangeText(e: React.ChangeEvent<HTMLInputElement>, field: string) {
        this.props.updateCurrentRow(e.target.value, field);
    }

    private renderDeleteWindow() {
        return <table className="table-view">
            <tbody>
                <tr>
                    <td><b><u>Delete Car</u></b></td>
                </tr>
                <tr>
                    <td>Are you sure you wish to delete the </td>
                </tr>
                <tr>
                    <td>
                        {this.props.currentCar.year == -1 ? '' : this.props.currentCar.year} {}
                        {this.props.currentCar.manufacturer} {}
                        {this.props.currentCar.make} {}
                        {this.props.currentCar.model}
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={() => this.deleteCarDetail()}>Delete</button> {}
                        <button onClick={() => this.showNewCar('')}>Cancel</button>
                    </td>
                </tr>
            </tbody>
        </table>;
    }

    private renderViewWindow() {
        return <table className="table-view">
            <tbody>
                <tr>
                    <td colSpan={2}><b><u>Car Details</u></b></td>
                </tr>
                <tr>
                    <td>Manufacturer</td>
                    <td>{this.props.currentCar.manufacturer}</td>
                </tr>
                <tr>
                    <td>Make</td>
                    <td>{this.props.currentCar.make}</td>
                </tr>
                <tr>
                    <td>Model</td>
                    <td>{this.props.currentCar.model}</td>
                </tr>
                <tr>
                    <td>Year</td>
                    <td>{this.props.currentCar.year == -1 ? '' : this.props.currentCar.year}</td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button onClick={() => this.showNewCar('')}>Cancel</button>
                    </td>
                </tr>
            </tbody>
        </table>;
    }

    private renderEditWindow() {
        return <div>
            <table className="table-view">
                <tbody>
                    <tr>
                        <td colSpan={2}><b><u>{this.props.mode == "edit" ? 'Edit Car' : 'Add New Car'}</u></b></td>
                    </tr>
                    <tr>
                        <td>Manufacturer</td>
                        <td><input type='text' value={this.props.currentCar.manufacturer}
                            onChange={(e) => this.onChangeText(e, "manufacturer")}></input></td>
                    </tr>
                    <tr>
                        <td>Make</td>
                        <td><input type='text' value={this.props.currentCar.make}
                            onChange={(e) => this.onChangeText(e, "make")}></input></td>
                    </tr>
                    <tr>
                        <td>Model</td>
                        <td><input type='text' value={this.props.currentCar.model}
                            onChange={(e) => this.onChangeText(e, "model")}></input></td>
                    </tr>
                    <tr>
                        <td>Year</td>
                        <td><input type='text' value={this.props.currentCar.year == -1 ? '' : this.props.currentCar.year}
                            onChange={(e) => this.onChangeText(e, "year")}></input></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button onClick={() => this.saveCarDetail()}>Save</button> {}
                            <button onClick={() => this.showNewCar('')}>Cancel</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
    }

    private showNewCar(mode = '', id = -1) {
        this.props.showNewCar(mode, id);
    }

    private saveCarDetail() {
        this.props.saveCarDetail();
    }

    private deleteCarDetail() {
        this.props.deleteCarDetail();
    }

    private renderCarList() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Manufacturer</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.props.cars.map((car, i) =>
                    <tr key={car.id}>
                        <td><a onClick={() => this.showNewCar('view', car.id)}>{car.manufacturer}</a></td>
                        <td>{car.make}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td className='td-action'>
                            <button onClick={() => this.showNewCar('edit', car.id)}>Edit</button> {}
                            <button onClick={() => this.showNewCar('delete', car.id)}>Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
            {(this.props.hasSaved || this.props.hasDeleted) &&
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            {
                                this.props.hasSaved ?
                                    'Car details saved successfully !' :
                                    'Car deleted successfully !'
                            }
                        </td>
                    </tr>
                </tfoot>
            }
        </table>;
    }
}

export default connect(
    (state: ApplicationState) => state.carList, // Selects which state properties are merged into the component's props
    carList.actionCreators                 // Selects which action creators are merged into the component's props
)(Home) as typeof Home;
