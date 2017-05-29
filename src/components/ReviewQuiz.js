import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { connectScreenSize } from 'react-screen-size';
import { findQuiz, mapScreenSizeToProps } from '../utils/helpers';

const renderMarkup = (html) => {
  return (
    <span dangerouslySetInnerHTML={{__html: html}}></span>
  );
}

const renderQuestion = (question) => {
  const solution = +question.get('solution');
  const title = question.get('title');
  const choices = question.get('choices');
   return (
     <div key={title}>
      <div className='reviewTitle'>
        <h1 className='questionTitle'>{renderMarkup(title)}</h1>
      </div>
      {choices.map((choice, index) => (
        <div
          key={choice}
          className={solution === index ? 'choice reivew solution' : 'choice review'}>
          <p>{renderMarkup(choice)}</p>
        </div>
      ))}
    </div>
  );
};

/* Review Quiz Questions Component */
class Review extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }
  handleKeyDown = ({ code }) => {
		if (code === 'Escape') this.props.history.push('/');
	}
  render() {
    const { quiz, screen } = this.props;
    if (!quiz) return null;
    const challenges = quiz.get('challenges');
    return (
      <div className='studyWrapper reviewContainer'>
				<div className='studyContainer'>
          <div className='quizHeader'>
            <div className='quizTitle'>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="fccLink"
                href="http://freecodecamp.com/">
                <img src="/assets/freeCodeCamp.png" alt="freeCodeCamp Logo" />
              </a>
              <span>{quiz.get('title')}</span>
            </div>
            <h3 className='quizMeta'>
              {challenges.size > 1 ? `${challenges.size} total questions` : ''}
            </h3>
            {screen.isDesktop && <span id="return">
              <Link to='/'>
                <i className="fa fa-times-circle" aria-hidden="true"></i>
              </Link>
            </span>}
          </div>
          {challenges.map(renderQuestion)}
				</div>
			</div>
    )
  }
}

const mapStateToProps = (state, props) => {

	const { title } = props.match.params;
  const quizzes = state.get('quizzes');

	const quiz = findQuiz(title, quizzes);

  if (!quiz) {
    props.history.push('/');
  }

	return { quiz };

};

const connectedReview = connect(mapStateToProps)(Review);
export default connectScreenSize(mapScreenSizeToProps)(connectedReview);
