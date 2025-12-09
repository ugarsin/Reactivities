using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollow
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FollowingId { get; set; } = Guid.NewGuid().ToString();
        public User Following { get; set; } = new User();
        public string FollowerId { get; set; } = Guid.NewGuid().ToString();
        public User Follower { get; set; }= new User();
    }
}
