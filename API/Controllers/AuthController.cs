using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AuthController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AuthController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(string username)
        {
            if (!await UserExists(username)) {
                return BadRequest($"No user exists with username {username}");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName.Equals(username));

            return Ok(_mapper.Map<UserDto>(user));
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");

            var user = _mapper.Map<User>(registerDto);

            using var hmac = new HMACSHA512();

            user.UserName = registerDto.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            return CreatedAtRoute(nameof(GetUser), new { Username = user.UserName }, GetUserDto(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.UserName.Equals(loginDto.UserName));

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return Ok(GetUserDto(user));
        }

        [HttpPost("username")]
        public async Task<IActionResult> UserExists(CheckUsernameDto checkUsernameDto)
        {
            var username = checkUsernameDto.UserName.ToLower();
            if (await _context.Users.AnyAsync(x => x.UserName.Equals(username)) || username.Equals("users1"))
            {
                return UnprocessableEntity(new { UserName = $"{username} is in use" });
            }
            else 
            {
                return Ok(new { Available = true });
            }
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        private UserDto GetUserDto(User user)
        {
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = _tokenService.CreateToken(user);

            return userDto;
        }
    }
}