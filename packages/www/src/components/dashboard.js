import React, { useContext, useRef } from 'react'
import { Link } from "@reach/router"
import { Container, Flex, Button, NavLink, Label, Input, Checkbox } from 'theme-ui'
import { gql, useMutation, useQuery } from '@apollo/client'
import { IdentityContext } from '../../identity-context'

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`
const UPDATE_TODO_DONE = gql`
  mutation UpdateTodoDone($id: ID!) {
    updateTodoDone(id: $id) {
      text
      done
    }
  }
`
const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`

export default () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext)
  const inputRef = useRef()
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE)
  const {loading, error, data, refetch} = useQuery(GET_TODOS)

  return (
    <Container>
      <Flex as="nav">
        <NavLink as={Link} to="/" p={2}>
          Home
        </NavLink>
        <NavLink as={Link} to="/app" p={2}>
          Dashborad
        </NavLink>
        {user && (
          <NavLink href="#!" p={2} onClick={() => netlifyIdentity.logout()}>
            Log out {user.user_metadata.full_name}
          </NavLink>
        )}
      </Flex>
      <Flex
        as="form"
        onSubmit={async e => {
          e.preventDefault()
          await addTodo({ variables: { text: inputRef.current.value } })
          inputRef.current.value = ''
          await refetch()
        }}
      >
        <Label sx={{ display: "flex" }}>
          <span>Add Todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }}></Input>
        </Label>
        <Button sx={{ marginLeft: 1 }}>Submit</Button>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        {loading ? <div>loading....</div> : ''}
        {error ? <div>Error: {error.message}</div> : ''}
        {!loading && !error && (
          <ul sx={{ listStyle: 'none' }}>
            {data.todos.map((todo) => (
              <Flex
                key={todo.id}
                as='li'
                onClick={async () => {
                  console.log('updateTOdoDone')
                  await updateTodoDone({ variables: { id: todo.id } })
                  console.log("refetching");
                  await refetch()
                }}
              >
                <Checkbox checked={todo.done} readOnly/>
                <span>{todo.text}</span>
              </Flex>
            ))}
          </ul>
        )}
      </Flex>
    </Container>
  );
}