import { Link } from "react-router-dom";
const NavLink = props => {
  const { disabled, handleClick, linkItem, styleLink } = props;
  return (
    <div disabled={disabled} onClick={handleClick}>
      <Link style={styleLink}>{linkItem}</Link>
    </div>
  );
};
export default NavLink;
