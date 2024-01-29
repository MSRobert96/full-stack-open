const Header = ({ text }) => <h1>{text}</h1>

const Total = ({ sum }) => <p>total of {sum} exercises</p>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) =>
    <>
        {parts.map(part => <Part key={part.key} part={part} />)}
        <Total sum={parts.reduce((acc, curr) => acc + curr.exercises, 0)} />
    </>

const Course = ({ course }) => 
    <>
        <Header text={course.name} />
        <Content parts={course.parts} />
    </>

export default Course