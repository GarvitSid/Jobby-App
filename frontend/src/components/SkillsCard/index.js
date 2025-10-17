import './index.css'

const SkillsCard = props => {
  const { skillDetails } = props
  const { name, imageUrl } = skillDetails
  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-image" />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillsCard