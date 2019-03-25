# Tests

## Location
Test file should be placed in the same folder as subject

## Naming convention
{subject-name}.test.{js | jsx}

* component: `hello-world.component.jsx` => `hello-world.test.jsx`
* container: `hello-world.container.js` => `hello-world.test.js`
* action: `hello-world.action.js` => `hello-world.test.js`
* selector: `hello-world.selector.js` => `hello-world.test.js`
* class/function: `hello-world.js` => `hello-world.test.js`
* hoc: @todo

## Mandatory Test Cases
### Components
*Components shouldn't have any kind of logic (filter, search, sorting)* 
#### 1. Snapshots

    describe('<HelloWorld />', () => {
      it('should match with snapshot', () => {
        const props = {};
        const tree = shallow(<HelloWorld {...props} />);
        expect(tree).toMatchSnapshot();
      });
    });

#### 2. Action simulation

    describe('<HelloWorld />', () => {
      let wrapper;
      let props;
    
      beforeEach(() => {
          props = {
            onClick: jest.fn(),
          };
          wrapper = shallow(<HelloWorld {...props} />);
        });
      
        it('should match with snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });
      
        it('should call onClick when button is clicked', () => {
          wrapper.find('button').simulate('click');
          expect(props.onClick.mock.calls.length).toBe(1);
        });
    });
    
### Containers

    import React from 'react';
    import sinon from 'sinon';
    import { fromJS } from 'immutable';
    
    import { AmbariStatus, mapStateToProps } from './ambari-status.container';
    
    describe('<AmbariStatus />', () => {
      describe('render: ', () => {
        it('should match with snapshot', () => {
          const props = {
            statuses: [{
              name: 'HDFS',
              state: 'STARTED',
              running: true,
            }],
            getAmbariStatus: jest.fn(),
          };
          const wrapper = shallow(<AmbariStatus {...props} />);
          expect(wrapper).toMatchSnapshot();
        });
      });
    
      describe('mapStateToProps: ', () => {
        it('should return the last statuses', () => {
          const initialState = {
            app: {
              ui: fromJS({
                ambariStatus: {
                  HDFS: {
                    state: "STARTED",
                    components: {
                      NAMENODE: "STARTED",
                      DATANODE: "STARTED"
                    },
                    running: true,
                  },
                },
              })
            }
          };
          const expectedResponse = [{
            name: 'HDFS',
            state: 'STARTED',
            running: true,
          }];
          expect(mapStateToProps(initialState).statuses).toEqual(expectedResponse);
        })
      });
    
      describe('actions: ', () => {
        it('should dispatch "getAmbariStatus" on componentDidMount lifecycle', () => {
          const spy = sinon.spy();
          const props = {
            statuses: [],
            getAmbariStatus: spy,
          };
          shallow(<AmbariStatus {...props}/>);
    
          expect(spy.callCount).toEqual(1);
        });
      })
    })    
    
### Actions

    import thunk from 'redux-thunk';
    import configureMockStore from 'redux-mock-store';
    import moxios from 'moxios';
    
    import ptrxREST from 'lib/rest/index';
    
    import evpActions from '../actions';
    import { getClusterRelations } from './cluster-relations.action';
    
    const mockStore = configureMockStore([thunk]); // create mock store
    const params = {
      behavior_type: 'suspicious',
      end_time: '06-23-2018',
      entity_id: '3a627a00-76c4-11e8-8caf-6bff10ab57c7',
      entity_name: '172.18.16.236 8.8.8.8',
      method_name: 'ranking',
      mode: 'realtime',
      model_name: '2018-04-29-Ranking-SipDip-1-ICMPEXFIL',
      pipeline: 'sipdip',
      start_time: '06-23-2018',
    };
    
    describe('cluster-relations action', () => {
      beforeEach(() => moxios.install(ptrxREST)); // mock axios call
      afterEach(() => moxios.uninstall(ptrxREST)); // release mock
    
      it('should dispatch SET_CLUSTER_RELATIONS action when fetching cluster relations has been done', (done) => {
        moxios.withMock(() => { // catch axios requests
          const expectedActions = [
            {
              'type': evpActions.FETCH_CLUSTER_RELATIONS,
            },
            {
              'type': evpActions.SET_CLUSTER_RELATIONS,
              'payload': {
                'clusterDetails': [],
                'clusterEntities': [
                  {
                    id: 1,
                  }],
              },
            },
          ];
    
          const store = mockStore({
            mockStore: [],
          });
    
          store.dispatch(getClusterRelations(params)); // dispatch action
    
          moxios.wait(() => { // wait for action to make the ajax call
            const request = moxios.requests.mostRecent();
            request.respondWith({ // response
              status: 200,
              response: {
                items: [],
              },
            })
              .then(() => {
                expect(store.getActions()).toEqual(expectedActions); // check store state with expected one
                done();
              });
          });
        });
      });
    });


### Selectors

    import { fromJS } from 'immutable';
    import { getLabelsHistory } from './labels.selectors';
    
    const initialState = {
      raw: fromJS({
        tags: {
          '939b67c3-c3e0-4dd4-999b-07768adc3916': {
            description: 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
            alert: 'True',
            href: '/api/v0.2/tags/939b67c3-c3e0-4dd4-999b-07768adc3916',
            id: '939b67c3-c3e0-4dd4-999b-07768adc3916',
            severity: 4,
            labels_count: 7,
            name: 'CC Fraud',
            system_tag: true,
            create_time: 'Fri, 01 Jul 2016 00:00:00 -0000',
            type: 'M',
          },
        },
        explodedView: {
          labelsHistory: [
            {
              status: 'active',
              pipeline: 'sip',
              weight: 1,
              time_start: 'Mon, 04 Jun 2018 08:57:00 -0000',
              score: null,
              entity_name: '10.202.88.31',
              entity_type: 'ip',
              predicted_tag_id: {
                '2018-03-26-Classifier-Sip-4': 'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1',
              },
              time_end: 'Mon, 04 Jun 2018 08:57:00 -0000',
              tag_id: '939b67c3-c3e0-4dd4-999b-07768adc3916',
              mode: 'realtime',
              type: 'local',
              id: '170d77a0-68ad-44fd-ad88-43b91008208b',
              description: '',
            }],
        },
      }),
    };
    
    describe('Label Selectors', () => {
      it('should return entity labels', () => {
        const expected = [
          {
            'create_time': 'Mon, 04 Jun 2018 08:57:00 -0000',
            'description': 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
            'id': '170d77a0-68ad-44fd-ad88-43b91008208b',
            'name': 'CC Fraud',
            'severity': 4,
            'type': 'M',
          }];
    
        expect(getLabelsHistory(initialState)).toEqual(expected);
      });
    });

### Classes/Functions

    describe('getZeppelinNoteBookReportIdId', () => {
      it('should return the report id', () => {
        const mockData = [
          {
            id: '2DDJT1RB1',
            name: 'Tenable Report',
          },
        ];
        const reportId = getZeppelinNoteBookReportIdId(mockData, 'Tenable Report');
        expect(reportId).toBe('2DDJT1RB1');
      });
    
      it('should return false', () => {
        const reportId = getZeppelinNoteBookReportIdId([], 'Tenable Report');
        expect(reportId).toBe(false);
      });
    }); 


## Signature
Each test should have status and author(s) signature.

    /**
     * @status: Complete | WIP
     * @sign-off-by: Author 1, Author 2
     */
     
## Mock functions

    jest.mock('model/actions/ui.actions', () => ({ addNotification: jest.fn(() => jest.fn()) }));
