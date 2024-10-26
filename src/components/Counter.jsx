import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCounter, decrement, fetchInitialCountAsync, increment, initCounter, randomize, selectCounters } from '../redux/slice/counterSlice';
import {fetchInitialCount} from '../api/apiRequests';

const Counter = ({predefinedValue}) => {
  const dispatch = useDispatch();
  const counters = useSelector(selectCounters);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInitialCount = async () => {
      if (!predefinedValue) {
        await dispatch(fetchInitialCountAsync());
      } else {
        await dispatch(initCounter(predefinedValue))
      }

      setLoading(false);
    };

    fetchInitialCount()
  }, [predefinedValue]);

  const handleAddCounter = async () => {
    const initialValue = predefinedValue || await fetchInitialCount();

    dispatch(addCounter(initialValue));
  };

  const handleDecrement = (id) => dispatch(decrement(id));

  const handleIncrement = (id) => dispatch(increment(id));

  const handleRandomize = (id) => dispatch(randomize(id));

  if (loading) {
    return <p>{'Loading...'}</p>;
  }

  return (
    <div className={'counter'}>
    <button onClick={handleAddCounter} className={'counter__button add-counter'}>{'Add Counter'}</button>
    {counters.length === 0 ? (
        <p>{'There are no available counters'}</p>
      ) : (
        counters.map((counter) => (
          <div key={counter.id}>
            <p>{'Counter'} {counter.id}: {counter.count}</p>
            <div className={'counter__buttons'}>
              <button onClick={() => handleDecrement(counter.id)} className={'counter__button decrement'}>{'Decrement'}</button>
              <button onClick={() => handleIncrement(counter.id)} className={'counter__button increment'}>{'Increment'}</button>
              <button onClick={() => handleRandomize(counter.id)} className={'counter__button randomize'}>{'Randomize'}</button>
            </div>
          </div>
        ))
      )}
  </div>
)};

export default Counter;
