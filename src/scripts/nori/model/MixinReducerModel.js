/**
 * Mixin for Nori models to add functionality similar to Redux' Reducer and single
 * object state tree concept. Mixin should be composed to nori/model/ApplicationModel
 * during creation of main AppModel
 *
 * https://gaearon.github.io/redux/docs/api/Store.html
 * https://gaearon.github.io/redux/docs/basics/Reducers.html
 *
 * Created 8/13/15
 */

define('nori/model/MixinReducerModel',
  function (require, module, exports) {

    var _this,
        _state         = requireNew('nori/model/SimpleStore'),
        _stateReducers = [];

    //----------------------------------------------------------------------------
    //  Accessors
    //----------------------------------------------------------------------------

    function getState() {
      return _state.getState();
    }

    function setState(state) {
      _state.setState(state);
    }

    function setReducers(reducerArray) {
      _stateReducers = reducerArray;
    }

    function addReducer(reducer) {
      _stateReducers.push(reducer);
    }

    //----------------------------------------------------------------------------
    //  Init
    //----------------------------------------------------------------------------

    /**
     * Set up event listener/receiver
     */
    function initializeReducerModel() {
      _this = this;
      Nori.dispatcher().registerReceiver(handleApplicationEvents);

      if (!_stateReducers) {
        throw new Error('ReducerModel, must set a reducer before initialization');
      }

      applyReducers({});
    }

    /**
     * Will receive "firehose" of all events that occur in the application. These
     * are sent to all reducers to update the state
     * @param eventObject
     */
    function handleApplicationEvents(eventObject) {
      console.log('ReducerModel Event occured: ', eventObject);
      applyReducers(eventObject);
    }

    function applyReducers(eventObject) {
      var nextState = applyReducersToState(getState(), eventObject);
      setState(nextState);

      _this.handleStateMutation();
    }

    /**
     * API hook to handled state updates
     */
    function handleStateMutation() {
      // override this
    }

    /**
     * Creates a new state from the combined reduces and event object
     * Model state isn't modified, current state is passed in and mutated state returned
     * @param state
     * @param event
     * @returns {*|{}}
     */
    function applyReducersToState(state, event) {
      state = state || {};
      _stateReducers.forEach(function applyStateReducerFunction(reducerFunc) {
        state = reducerFunc(state, event);
      });
      return state;
    }

    /**
     * Template reducer function
     * Model state isn't modified, current state is passed in and mutated state returned
     */
      //function templateReducerFunction(state, event) {
      //  state = state || {};
      //  switch (event.type) {
      //    case _noriEventConstants.MODEL_DATA_CHANGED:
      //      // can compose other reducers
      //      // return _.assign({}, state, otherStateTransformer(state));
      //      return _.assign({}, state, {prop: event.payload.value});
      //    default:
      //      return state;
      //  }
      //}

      //----------------------------------------------------------------------------
      //  API
      //----------------------------------------------------------------------------

    module.exports.initializeReducerModel  = initializeReducerModel;
    module.exports.getState                = getState;
    module.exports.setState                = setState;
    module.exports.handleApplicationEvents = handleApplicationEvents;
    module.exports.setReducers             = setReducers;
    module.exports.addReducer              = addReducer;
    module.exports.applyReducers           = applyReducers;
    module.exports.applyReducersToState    = applyReducersToState;
    module.exports.handleStateMutation     = handleStateMutation;
  });