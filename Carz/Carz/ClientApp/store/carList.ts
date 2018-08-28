import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface carList {
    isLoading: boolean;
    cars: car[];
    mode: string;
    currentCar: car,
    hasSaved: boolean,
    hasDeleted: boolean
}

export interface car {
    id: number;
    manufacturer: string;
    make: string;
    model: string;
    year: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCarListAction {
    type: 'REQUEST_CAR_LIST';
}

interface ReceiveCarListAction {
    type: 'RECEIVE_CAR_LIST';
    cars: car[];
}

interface ShowNewCar {
    type: 'SHOW_NEW_CAR';
    mode: string;
    id: number;
}

interface updateCurrentRow {
    type: 'UPDATE_CURRENT_ROW';
    value: string;
    field: string;
}

interface saveCarDetail {
    type: 'SAVE_CAR_DETAILS';
}

interface deleteCarDetail {
    type: 'DELETE_CAR_DETAILS';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCarListAction | ReceiveCarListAction | ShowNewCar | updateCurrentRow | saveCarDetail | deleteCarDetail;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    getCarList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        let fetchTask = fetch(`http://localhost:60001/api/car`)
            .then(response => {
                return response.json() as Promise<car[]>
            })
            .then(data => {
                dispatch({ type: 'RECEIVE_CAR_LIST', cars: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_CAR_LIST' });
    },
    showNewCar: (mode: string, id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SHOW_NEW_CAR', mode: mode, id: id });
    },
    updateCurrentRow: (value: string, field: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_CURRENT_ROW', value: value, field: field });
    },
    saveCarDetail: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let saveTask = fetch(`http://localhost:60001/api/car`, {
            method: 'POST',
            body: JSON.stringify(getState().carList.currentCar),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
        })
            .then(response => {
                return response.json() as Promise<boolean>
            })
            .then(data => {
                dispatch({ type: 'SAVE_CAR_DETAILS' });
            });

        addTask(saveTask); // Ensure server-side prerendering waits for this to complete
    },
    deleteCarDetail: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let deleteTask = fetch(`http://localhost:60001/api/car/` + getState().carList.currentCar.id, {
            method: 'delete'
        })
            .then(response => {
                return response.json() as Promise<boolean>
            })
            .then(data => {
                dispatch({ type: 'DELETE_CAR_DETAILS' });
            });

        addTask(deleteTask); // Ensure server-side prerendering waits for this to complete
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: carList = {
    cars: [], isLoading: false, mode: '', hasSaved: false, hasDeleted: false,
    currentCar: { id: -1, make: '', manufacturer: '', model: '', year: -1 }
};

export const reducer: Reducer<carList> = (state: carList, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CAR_LIST':
            return {
                cars: state.cars,
                isLoading: true,
                mode: state.mode,
                currentCar: state.currentCar,
                hasSaved: state.hasSaved,
                hasDeleted: state.hasDeleted
            };
        case 'RECEIVE_CAR_LIST':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                cars: action.cars,
                isLoading: false,
                mode: state.mode,
                currentCar: state.currentCar,
                hasSaved: state.hasSaved,
                hasDeleted: state.hasDeleted
            };
        case 'SHOW_NEW_CAR':
            let currentCar = { id: -1, make: '', manufacturer: '', model: '', year: -1 };
            if (action.id > -1) {
                currentCar = state.cars.filter(c => c.id == action.id)[0];
            }
            return {
                cars: state.cars,
                isLoading: state.isLoading,
                mode: action.mode,
                currentCar: currentCar,
                hasSaved: false,
                hasDeleted: false
            };
        case 'UPDATE_CURRENT_ROW':
            currentCar = Object.assign({}, state.currentCar, { [action.field]: action.value });
            return {
                cars: state.cars,
                isLoading: state.isLoading,
                mode: state.mode,
                currentCar: currentCar,
                hasSaved: false,
                hasDeleted: false
            };
        case 'SAVE_CAR_DETAILS':
            return {
                cars: state.cars,
                isLoading: state.isLoading,
                mode: '',
                currentCar: state.currentCar,
                hasSaved: true,
                hasDeleted: false
            };
        case 'DELETE_CAR_DETAILS':
            return {
                cars: state.cars,
                isLoading: state.isLoading,
                mode: '',
                currentCar: state.currentCar,
                hasSaved: false,
                hasDeleted: true
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
