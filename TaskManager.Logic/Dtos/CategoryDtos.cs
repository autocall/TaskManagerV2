namespace TaskManager.Logic.Dtos;

public class CategoryDto : BaseCompanyDto {
    public string Name { get; set; }
    public int Color { get; set; }
    public byte Order { get; set; }
}

public class CreateCategoryDto {
    public string Name { get; set; }
    public int Color { get; set; }
}

public class UpdateCategoryDto {
    public int Id { get; set; }

    public string Name { get; set; }
    public int Color { get; set; }
}

public class UpdateCategoryOrderDto {
    public int Id { get; set; }
    /// <summary>
    ///     +1 / -1 </summary>
    public int Order { get; set; }
}