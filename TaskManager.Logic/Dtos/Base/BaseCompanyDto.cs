using TaskManager.Common;

namespace TaskManager.Logic.Dtos;

public abstract class BaseCompanyDto : BaseDto, IDeepCloneable<BaseCompanyDto> {
    public int CompanyId { get; set; }

    public override BaseCompanyDto Clone() {
        return (BaseCompanyDto)this.MemberwiseClone();
    }
}