import { Link, redirect, useNavigate, useNavigation, useParams, useSubmit } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx'
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const submit = useSubmit();
  const params = useParams();


  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000,
  })

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => { // mutate함수가 실행되면 바로 작동함.
  //     const newEvent = data.event;

  //     // 업데이트 요청이 완료되기 전에 이러한 진행중인 요청이 완료되면 이전 데이터를 가져오게 되므로 await 해야한다.
  //     await queryClient.cancelQueries({ queryKey: ['events', params.id] }); //업데이트 하기전 기존 데이터에 대한 진행중인 쿼리를 취소함.
  //     const previousEvent = queryClient.getQueryData(['events', params.id]);

  //     queryClient.setQueryData(['events', params.id], newEvent); // 낙관적 업데이트로서, 응답을 기다리지 않고 즉시 데이터를 수정.
  //     return { previousEvent }
  //   },
  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(['events', params.id], context.previousEvent)
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(['events', params.id]);
  //   }
  // })

  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' }); //action함수 트리거.
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock title="Failed to load event" message={error.info?.message || "Failed to loade event, Please check your inputs and try again later. "} />
        <div className='form-actions'>
          <Link to="../" className='button'>
            Okay
          </Link >
        </div >
      </>
    )
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? <p>Sending data...</p> : <>
          <Link to="../" className="button - text">
            Cancel
          </Link >
          <button type="submit" className="button">
            Update
          </button>
        </>}
      </EventForm >
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal >
  );
}

export function loader(params) {
  return queryClient.fetchEvent({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData); // formData 메소드로 생성된 복잡한 객체가 자바스크립트의 키-값 쌍 객체로 변환됨.
  await updateEvent({ id: params.id, event: updateEventData });
  await queryClient.invalidateQueries(['events']);
  return redirect('../');
}